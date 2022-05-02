import MovieListDao from "../daos/MovieListDao";
import {Express, NextFunction, Request, Response} from "express";
import {
    EmptyMovieListNameError,
    InvalidInputError,
    MovieListAlreadyExistsError, NoPermissionError,
    NoSuchMovieListError
} from "../errors/CustomErrors";
import AuthenticationController from "./AuthenticationController";
import {MY} from "../utils/constants";

const ObjectId = require('mongoose').Types.ObjectId;

class MovieListController {

    private static movieListController: MovieListController | null = null;
    private static movieListDao: MovieListDao = MovieListDao.getInstance();

    public static getInstance = (app: Express) => {
        if (MovieListController.movieListController === null) {
            MovieListController.movieListController = new MovieListController();
            app.post("/api/users/:uid/movie-lists", MovieListController.movieListController.createMovieList);
            app.get("/api/movie-lists", MovieListController.movieListController.findAllMovieLists);
            app.get("/api/movie-lists/:lid", MovieListController.movieListController.findMovieListById);
            app.get("/api/users/:uid/movie-lists", MovieListController.movieListController.findAllMovieListsOwnedByUser);
            app.get("/api/movie-lists/name/:lname", MovieListController.movieListController.findMovieListByListName);
            app.delete("/api/movie-lists", MovieListController.movieListController.deleteAllMovieLists);
            app.delete("/api/movie-lists/:lid", MovieListController.movieListController.deleteMovieListById);
            app.put("/api/users/:uid/movie-lists/:lid", MovieListController.movieListController.updateMovieListById);
        }
        return MovieListController.movieListController;
    }

    createMovieList = async (req: Request, res: Response, next: NextFunction) => {
        // authentication
        let userId, profile;
        try {
            profile = AuthenticationController.checkLogin(req);
            userId = await AuthenticationController.getUserId(req, profile);
        } catch (e) {
            next(e)
            return;
        }
        if (!ObjectId.isValid(userId)) {
            next(new InvalidInputError("Received invalid id"));
            return;
        }
        // get list info
        const data = req.body;
        if (!data.listName) {
            next(new EmptyMovieListNameError());
            return
        }
        const listName = data.listName;
        const existingList = await MovieListController.movieListDao.findMovieListOwnedByUserByName(userId, listName);
        if (existingList) {
            next(new MovieListAlreadyExistsError);
            return;
        }
        const movies = data.movies ? this.getUniqueMovies(data.movies) : [];
        const movieList = {ownedBy: userId, listName: listName, movies: movies};
        // @ts-ignore
        MovieListController.movieListDao.createMovieList(movieList)
            .then((movieList) => res.json(movieList))
            .catch(next);
    }

    findMovieListById = (req: Request, res: Response, next: NextFunction) => {
        const movieListId = req.params.lid;
        if (!ObjectId.isValid(movieListId)) {
            next(new InvalidInputError("Received invalid id"));
            return;
        }
        MovieListController.movieListDao.findMovieListById(req.params.lid)
            .then((list) => res.json(list))
            .catch(next);
    }

    findAllMovieLists = (req: Request, res: Response) => {
        MovieListController.movieListDao.findAllMovieLists().then((lists) => res.json(lists));
    }

    deleteAllMovieLists = async (req: Request, res: Response, next: NextFunction) => {
        let profile;
        try {
            profile = AuthenticationController.checkLogin(req);
        } catch (e) {
            next(e);
            return
        }
        const isAdmin = await AuthenticationController.isAdmin(profile.username);
        if (isAdmin) {
            MovieListController.movieListDao.deleteAllMovieLists()
                .then((status) => res.json(status));
        } else {
            next(new NoPermissionError());
        }
    }

    deleteMovieListById = async (req: Request, res: Response, next: NextFunction) => {
        let profile;
        try {
            profile = AuthenticationController.checkLogin(req);
        } catch (e) {
            next(e)
            return;
        }
        const listId = req.params.lid;
        const userId = profile._id;
        if (!ObjectId.isValid(userId) || !ObjectId.isValid(listId)) {
            next(new InvalidInputError("Received invalid id"));
            return;
        }
        const isAdmin = await AuthenticationController.isAdmin(profile.username);
        if (isAdmin) {
            MovieListController.movieListDao.deleteMovieListById(listId)
                .then((status) => res.json(status))
                .catch(next);
        } else {
            const userOwnsList = await MovieListController.movieListDao.findMovieListOwnedByUser(userId, listId);
            if (userOwnsList) {
                MovieListController.movieListDao.deleteMovieListById(listId)
                    .then((status) => res.json(status))
                    .catch(next);
            } else {
                next(new NoPermissionError());
            }
        }
    }

    updateMovieListById = async (req: Request, res: Response, next: NextFunction) => {
        // authentication and get user id
        let userId, profile;
        try {
            profile = AuthenticationController.checkLogin(req);
            userId = await AuthenticationController.getUserId(req, profile);
        } catch (e) {
            next(e)
            return;
        }
        const listId = req.params.lid;
        if (!ObjectId.isValid(userId) || !ObjectId.isValid(listId)) {
            next(new InvalidInputError("Received invalid id"));
            return;
        }
        const data = req.body;
        const newMovieList = {};
        // check inputs
        if (data.movies && Array.isArray(data.movies)) {
            // @ts-ignore
            newMovieList["movies"] = this.getUniqueMovies(data.movies);
        }
        if (data.listName) {
            // @ts-ignore
            newMovieList["listName"] = data.listName;
        }
        if (newMovieList) {
            const existingMovieList = await MovieListController.movieListDao.findMovieListById(listId);
            if (existingMovieList) {
                // @ts-ignore
                MovieListController.movieListDao.updateMovieListById(listId, newMovieList)
                    .then((status) => res.json(status))
                    .catch(next);
            } else {
                next(new NoSuchMovieListError);
            }
        } else {
            res.sendStatus(200);
        }
    }

    findAllMovieListsOwnedByUser = async (req: Request, res: Response, next: NextFunction) => {
        let profile, userId;
        userId = req.params.uid;
        if (userId === MY) {
            try {
                profile = AuthenticationController.checkLogin(req);
                userId = profile._id;
            } catch (e) {
                next(e);
                return;
            }
        }
        if (!ObjectId.isValid(userId)) {
            next(new InvalidInputError("Received invalid id"));
            return;
        }
        MovieListController.movieListDao.findAllMovieListsOwnedByUser(userId)
            .then((lists) => res.json(lists))
            .catch(next);
    }

    findMovieListByListName = async (req: Request, res: Response, next: NextFunction) => {
        const listName = req.params.lname
        MovieListController.movieListDao.findMovieListByName(listName)
            .then((list) => res.json(list))
            .catch(next);
    }

    private getUniqueMovies = (movies: string[]) => {
        return [...new Set(movies.map((m: any) => m + ""))];
    }

}
export default MovieListController;