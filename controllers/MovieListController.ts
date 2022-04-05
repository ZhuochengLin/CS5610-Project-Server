import MovieListDao from "../daos/MovieListDao";
import {Express, NextFunction, Request, Response} from "express";
import {
    EmptyMovieListNameError,
    InvalidInputError,
    MovieListAlreadyExistsError,
    NoSuchMovieListError
} from "../errors/CustomErrors";

class MovieListController {

    private static movieListController: MovieListController | null = null;
    private static movieListDao: MovieListDao = MovieListDao.getInstance();

    public static getInstance = (app: Express) => {
        if (MovieListController.movieListController === null) {
            MovieListController.movieListController = new MovieListController();
            app.post("/api/users/:uid/movie-lists", MovieListController.movieListController.createMovieList);
            app.get("/api/movie-lists", MovieListController.movieListController.findAllMovieLists);
            app.get("/api/movie-lists/:lid", MovieListController.movieListController.findMovieListById);
            app.get("/api/users/:uid/movie-lists", MovieListController.movieListController.findMovieListsOwnedByUser);
            app.get("/api/movie-lists/name/:lname", MovieListController.movieListController.findMovieListByListName);
            app.delete("/api/movie-lists", MovieListController.movieListController.deleteAllMovieLists);
            app.delete("/api/movie-lists/:lid", MovieListController.movieListController.deleteMovieListById);
            app.put("/api/movie-lists/:lid", MovieListController.movieListController.updateMovieListById);
        }
        return MovieListController.movieListController;
    }

    createMovieList = async (req: Request, res: Response, next: NextFunction) => {
        // TODO: authentication
        const data = req.body;
        if (!data.listName) {
            next(new EmptyMovieListNameError());
            return
        }
        const listName = data.listName;
        const existingList = await MovieListController.movieListDao.findMovieListByName(listName);
        if (existingList) {
            next(new MovieListAlreadyExistsError);
            return;
        }
        const movies = data.movies ? data.movies : [];
        // @ts-ignore
        MovieListController.movieListDao.createMovieList(req.params.uid, listName, movies)
            .then((movieList) => res.json(movieList))
            .catch(next);
    }

    findMovieListById = (req: Request, res: Response, next: NextFunction) => {
        MovieListController.movieListDao.findMovieListById(req.params.lid)
            .then((list) => res.json(list))
            .catch(next);
    }

    findAllMovieLists = (req: Request, res: Response) => {
        MovieListController.movieListDao.findAllMovieLists().then((lists) => res.json(lists));
    }

    deleteAllMovieLists = (req: Request, res: Response) => {
        // TODO: authentication + access control
        MovieListController.movieListDao.deleteAllMovieLists()
            .then((status) => res.json(status));
    }

    deleteMovieListById = (req: Request, res: Response, next: NextFunction) => {
        // TODO: authentication + access control
        MovieListController.movieListDao.deleteMovieListById(req.params.lid)
            .then((status) => res.json(status))
            .catch(next);
    }

    updateMovieListById = async (req: Request, res: Response, next: NextFunction) => {
        // TODO: authentication
        const newMovies = req.body.movies;
        const listId = req.params.lid;
        if (!Array.isArray(newMovies)) {
            next(new InvalidInputError());
            return;
        }
        if (newMovies) {
            const existingMovieList = await MovieListController.movieListDao.findMovieListById(listId);
            if (existingMovieList) {
                MovieListController.movieListDao.updateMovieListById(req.params.lid, newMovies)
                    .then((status) => res.json(status))
                    .catch(next);
            } else {
                next(new NoSuchMovieListError);
            }
        } else {
            res.sendStatus(200);
        }
    }

    findMovieListsOwnedByUser = async (req: Request, res: Response, next: NextFunction) => {
        // TODO: authentication
        const userId = req.params.uid;
        MovieListController.movieListDao.findMovieListsOwnedByUser(userId)
            .then((lists) => res.json(lists))
            .catch(next);
    }

    findMovieListByListName = async (req: Request, res: Response, next: NextFunction) => {
        const listName = req.params.lname
        MovieListController.movieListDao.findMovieListByName(listName)
            .then((list) => res.json(list))
            .catch(next);
    }

}
export default MovieListController;