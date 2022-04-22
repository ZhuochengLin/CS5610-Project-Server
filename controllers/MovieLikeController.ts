import {Express, NextFunction, Request, Response} from "express";
import MovieLikeDao from "../daos/MovieLikeDao";
import AuthenticationController from "./AuthenticationController";
import {MY} from "../utils/constants";
import {InvalidInputError, NoPermissionError} from "../errors/CustomErrors";
import MovieStatsDao from "../daos/MovieStatsDao";

const ObjectId = require('mongoose').Types.ObjectId;

export default class MovieLikeController {

    private static movieLikeController: MovieLikeController | null = null;
    private static movieLikeDao: MovieLikeDao = MovieLikeDao.getInstance();
    private static movieStatsDao: MovieStatsDao = MovieStatsDao.getInstance();

    private constructor() {
    }

    public static getInstance = (app: Express) => {
        if (MovieLikeController.movieLikeController === null) {
            MovieLikeController.movieLikeController = new MovieLikeController();
            app.get("/api/movie-likes", MovieLikeController.movieLikeController.findAllLikes);
            app.get("/api/users/:uid/movie-likes", MovieLikeController.movieLikeController.findAllMoviesLikedByUser);
            app.get("/api/users/:uid/movie-likes/:mid", MovieLikeController.movieLikeController.findUserLikesMovie);
            app.post("/api/users/:uid/movie-likes/:mid", MovieLikeController.movieLikeController.userLikesMovie);
            app.delete("/api/movie-likes", MovieLikeController.movieLikeController.deleteAllLikes);
        }
        return MovieLikeController.movieLikeController;
    }

    findAllLikes = (req: Request, res: Response) => {
        MovieLikeController.movieLikeDao.findAllLikes()
            .then(likes => res.json(likes));
    }

    userLikesMovie = async (req: Request, res: Response, next: NextFunction) => {
        let userId, profile;
        try {
            profile = AuthenticationController.checkLogin(req);
            userId = await AuthenticationController.getUserId(req, profile);
        } catch (e) {
            next(e)
            return;
        }
        if (userId === MY) {
            next(new InvalidInputError("Admin account cannot likes review"))
            return;
        }
        const movieId = req.params.mid;
        if (!ObjectId.isValid(userId)) {
            next(new InvalidInputError("Received invalid id"));
            return;
        }
        try {
            const userAlreadyLikesReview = await MovieLikeController.movieLikeDao.findUserLikesMovie(userId, movieId);
            if (userAlreadyLikesReview) {
                await MovieLikeController.movieLikeDao.userUnlikesMovie(userId, movieId);
            } else {
                await MovieLikeController.movieLikeDao.userLikesMovie(userId, movieId);
            }
            // update movie stats
            const existingMovieStats = await MovieLikeController.movieStatsDao.findMovieStats(movieId);
            if (!existingMovieStats) {
                await MovieLikeController.movieStatsDao.createMovieStats(movieId);
            }
            const newLikes = await MovieLikeController.movieLikeDao.findHowManyLikesOfMovie(movieId);
            await MovieLikeController.movieStatsDao.updateMovieStats(movieId, {stats: {likes: newLikes}});
        } catch (e) {
            next(e);
            return;
        }
        res.sendStatus(200);
    }

    deleteAllLikes = async (req: Request, res: Response, next: NextFunction) => {
        let profile;
        try {
            profile = AuthenticationController.checkLogin(req);
        } catch (e) {
            next(e);
            return
        }
        const isAdmin = await AuthenticationController.isAdmin(profile.username);
        if (isAdmin) {
            MovieLikeController.movieLikeDao.deleteAllLikes()
                .then((status) => res.json(status));
        } else {
            next(new NoPermissionError());
        }
    }

    findAllMoviesLikedByUser = (req: Request, res: Response, next: NextFunction) => {
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
        MovieLikeController.movieLikeDao.findAllMoviesLikedByUser(userId)
            .then((likes) => res.json(likes))
            .catch(next);
    }

    findUserLikesMovie = (req: Request, res: Response, next: NextFunction) => {
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
        const movieId = req.params.mid;
        if (!ObjectId.isValid(userId)) {
            next(new InvalidInputError("Received invalid id"));
            return;
        }
        MovieLikeController.movieLikeDao.findUserLikesMovie(userId, movieId)
            .then(result => res.json(result))
            .catch(next)
    }

}