import MovieReviewDao from "../daos/MovieReviewDao";
import {Express, NextFunction, Response, Request} from "express";
import AuthenticationController from "./AuthenticationController";
import {MY} from "../utils/constants";
import {InvalidInputError, MovieReviewAlreadyExistsError, NoPermissionError} from "../errors/CustomErrors";

const ObjectId = require('mongoose').Types.ObjectId;

export default class MovieReviewController {

    private static movieReviewController: MovieReviewController | null = null;
    private static movieReviewDao: MovieReviewDao = MovieReviewDao.getInstance();

    private constructor() {
    }

    public static getInstance = (app: Express) => {
        if (MovieReviewController.movieReviewController === null) {
            MovieReviewController.movieReviewController = new MovieReviewController();
            app.get("/api/movie-reviews", MovieReviewController.movieReviewController.findAllReviews);
            app.get("/api/movie-reviews/:rid", MovieReviewController.movieReviewController.findReviewById);
            app.post("/api/users/:uid/movie-reviews", MovieReviewController.movieReviewController.createReview);
            app.delete("/api/movie-reviews", MovieReviewController.movieReviewController.deleteAllReviews);
            app.delete("/api/users/:uid/movie-reviews/:rid", MovieReviewController.movieReviewController.deleteReviewById);
            app.get("/api/users/:uid/movie-reviews", MovieReviewController.movieReviewController.findAllReviewsOwnedByUser);
            app.put("/api/users/:uid/movie-reviews/:rid", MovieReviewController.movieReviewController.updateMovieReview);
            app.get("/api/movies/:mid/movie-reviews", MovieReviewController.movieReviewController.findAllReviewsOfMovie);
            app.get("/api/users/:uid/movie-reviews/:rid", MovieReviewController.movieReviewController.findReviewOnMovieOwnedByUsr);
        }
        return MovieReviewController.movieReviewController;
    }

    createReview = async (req: Request, res: Response, next: NextFunction) => {
        let userId, profile;
        try {
            profile = AuthenticationController.checkLogin(req);
            userId = await AuthenticationController.getUserId(req, profile);
        } catch (e) {
            next(e)
            return;
        }
        if (userId === MY) {
            next(new InvalidInputError("Admin account cannot create movie lists"))
            return;
        }
        if (!ObjectId.isValid(userId)) {
            next(new InvalidInputError("Received invalid id"));
            return;
        }
        const data = req.body;
        if (!data.movieId || !data.review || !data.rating) {
            next(new InvalidInputError("Missing values"));
            return;
        }
        const existingReview = await MovieReviewController.movieReviewDao.findReviewOnMovieOwnedByUsr(userId, data.movieId);
        if (existingReview) {
            next(new MovieReviewAlreadyExistsError());
            return;
        }
        MovieReviewController.movieReviewDao.createReview({postedBy: userId, ...data})
            .then(review => res.json(review))
            .catch(next);
    }

    findAllReviews = (req: Request, res: Response, next: NextFunction) => {
        MovieReviewController.movieReviewDao.findAllReviews()
            .then(reviews => res.json(reviews))
            .catch(next);
    }

    findReviewById = (req: Request, res: Response, next: NextFunction) => {
        MovieReviewController.movieReviewDao.findReviewById(req.params.rid)
            .then(r => res.json(r))
            .catch(next)
    }

        findAllReviewsOwnedByUser = (req: Request, res: Response, next: NextFunction) => {
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
        MovieReviewController.movieReviewDao.findAllReviewsOwnedByUser(userId)
            .then((lists) => res.json(lists))
            .catch(next);
    }

    deleteAllReviews = async (req: Request, res: Response, next: NextFunction) => {
        let profile;
        try {
            profile = AuthenticationController.checkLogin(req);
        } catch (e) {
            next(e);
            return
        }
        const isAdmin = await AuthenticationController.isAdmin(profile.username);
        if (isAdmin) {
            MovieReviewController.movieReviewDao.deleteAllReviews()
                .then((status) => res.json(status));
        } else {
            next(new NoPermissionError());
        }
    }

    deleteReviewById = async (req: Request, res: Response, next: NextFunction) => {
        let profile;
        try {
            profile = AuthenticationController.checkLogin(req);
        } catch (e) {
            next(e)
            return;
        }
        const reviewId = req.params.rid;
        const userId = profile._id;
        if (!ObjectId.isValid(userId) || !ObjectId.isValid(reviewId)) {
            next(new InvalidInputError("Received invalid id"));
            return;
        }
        const isAdmin = await AuthenticationController.isAdmin(profile.username);
        if (isAdmin) {
            MovieReviewController.movieReviewDao.deleteReviewById(reviewId)
                .then((status) => res.json(status))
                .catch(next);
        } else {
            const userOwnsReview = await MovieReviewController.movieReviewDao.findReviewOwnedByUsr(userId, reviewId);
            if (userOwnsReview) {
                MovieReviewController.movieReviewDao.deleteReviewById(reviewId)
                    .then((status) => res.json(status))
                    .catch(next);
            } else {
                next(new NoPermissionError());
            }
        }
    }

    updateMovieReview = async (req: Request, res: Response, next: NextFunction) => {
        let userId, profile;
        try {
            profile = AuthenticationController.checkLogin(req);
            userId = await AuthenticationController.getUserId(req, profile);
        } catch (e) {
            next(e)
            return;
        }
        if (userId === MY) {
            next(new InvalidInputError("Admin account does not have movie lists."))
            return;
        }
        const reviewId = req.params.rid;
        if (!ObjectId.isValid(userId) || !ObjectId.isValid(reviewId)) {
            next(new InvalidInputError("Received invalid id"));
            return;
        }
        const existingReview = await MovieReviewController.movieReviewDao.findReviewOwnedByUsr(userId, reviewId);
        if (existingReview) {
            const data = req.body;
            MovieReviewController.movieReviewDao.updateMovieReview(reviewId, data)
                .then(status => res.json(status))
                .catch(next);
        } else {
            next(new NoPermissionError());
        }
    }

    findAllReviewsOfMovie = (req: Request, res: Response, next: NextFunction) => {
        MovieReviewController.movieReviewDao.findAllReviewsOfMovie(req.params.mid)
            .then(reviews => res.json(reviews))
            .catch(next);
    }

    findReviewOnMovieOwnedByUsr = (req: Request, res: Response, next: NextFunction) => {
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
        const reviewId = req.params.rid;
        if (!ObjectId.isValid(userId) || !ObjectId.isValid(reviewId)) {
            next(new InvalidInputError("Received invalid id"));
            return;
        }
        MovieReviewController.movieReviewDao.findReviewOwnedByUsr(userId, reviewId)
            .then(review => res.json(review))
            .catch(next)
    }
}