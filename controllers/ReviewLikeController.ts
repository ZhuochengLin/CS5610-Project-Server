import ReviewLikeDao from "../daos/ReviewLikeDao";
import {Express, NextFunction, Request, Response} from "express";
import AuthenticationController from "./AuthenticationController";
import {MY} from "../utils/constants";
import {InvalidInputError, NoPermissionError} from "../errors/CustomErrors";
import MovieReviewDao from "../daos/MovieReviewDao";

const ObjectId = require('mongoose').Types.ObjectId;

export default class ReviewLikeController {

    private static likeController: ReviewLikeController | null = null;
    private static reviewLikeDao: ReviewLikeDao = ReviewLikeDao.getInstance();
    private static reviewDao: MovieReviewDao = MovieReviewDao.getInstance();

    private constructor() {
    }

    public static getInstance = (app: Express) => {
        if (ReviewLikeController.likeController === null) {
            ReviewLikeController.likeController = new ReviewLikeController();
            app.get("/api/review-likes", ReviewLikeController.likeController.findAllLikes);
            app.get("/api/users/:uid/review-likes", ReviewLikeController.likeController.findAllReviewsLikedByUser);
            app.get("/api/users/:uid/review-likes/:rid", ReviewLikeController.likeController.findUserLikesReview);
            app.post("/api/users/:uid/review-likes/:rid", ReviewLikeController.likeController.userLikesReview);
            app.delete("/api/review-likes", ReviewLikeController.likeController.deleteAllLikes);
        }
        return ReviewLikeController.likeController;
    }

    findAllLikes = (req: Request, res: Response) => {
        ReviewLikeController.reviewLikeDao.findAllLikes()
            .then(likes => res.json(likes));
    }

    userLikesReview = async (req: Request, res: Response, next: NextFunction) => {
        let userId, profile;
        try {
            profile = AuthenticationController.checkLogin(req);
            userId = await AuthenticationController.getUserId(req, profile);
        } catch (e) {
            next(e)
            return;
        }
        const reviewId = req.params.rid;
        if (!ObjectId.isValid(userId) || !ObjectId.isValid(reviewId)) {
            next(new InvalidInputError("Received invalid id"));
            return;
        }
        const userAlreadyLikesReview = await ReviewLikeController.reviewLikeDao.findUserLikesReview(userId, reviewId);
        if (userAlreadyLikesReview) {
            try {
                await ReviewLikeController.reviewLikeDao.userUnLikesReview(userId, reviewId);
            } catch (e) {
                next(e);
                return;
            }
        } else {
            try {
                await ReviewLikeController.reviewLikeDao.userLikesReview(userId, reviewId);
            } catch (e) {
                next(e);
                return;
            }
        }
        const newLikes = await ReviewLikeController.reviewLikeDao.findHowManyLikesOfReview(reviewId);
        await ReviewLikeController.reviewDao.updateMovieReview(reviewId, {stats: {likes: newLikes}});
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
            ReviewLikeController.reviewLikeDao.deleteAllLikes()
                .then((status) => res.json(status));
        } else {
            next(new NoPermissionError());
        }
    }

    findAllReviewsLikedByUser = (req: Request, res: Response, next: NextFunction) => {
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
        ReviewLikeController.reviewLikeDao.findAllReviewsLikedByUser(userId)
            .then((likes) => res.json(likes))
            .catch(next);
    }

    findUserLikesReview = (req: Request, res: Response, next: NextFunction) => {
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
        ReviewLikeController.reviewLikeDao.findUserLikesReview(userId, reviewId)
            .then(result => res.json(result))
            .catch(next)
    }
}