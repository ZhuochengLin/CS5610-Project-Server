import FollowDao from "../daos/FollowDao";
import {Express, NextFunction, Request, Response} from "express";
import AuthenticationController from "./AuthenticationController";
import {MY} from "../utils/constants";
import {InvalidInputError, NoPermissionError, NoSuchUserError} from "../errors/CustomErrors";
import UserDao from "../daos/UserDao";

const ObjectId = require('mongoose').Types.ObjectId;

export default class FollowController {

    private static followController: FollowController | null = null;
    private static followDao: FollowDao = FollowDao.getInstance();
    private static userDao: UserDao = UserDao.getInstance();

    private constructor() {
    }

    public static getInstance = (app: Express) => {
        if (FollowController.followController === null) {
            FollowController.followController = new FollowController();
            app.post("/api/users/:uid/follows/:uidb", FollowController.followController.userAFollowsUserB);
            app.get("/api/follows", FollowController.followController.findAllFollows);
            app.get("/api/users/:uid/followings", FollowController.followController.findFollowings);
            app.get("/api/users/:uid/followers", FollowController.followController.findFollowers);
            app.get("/api/users/:uid/follows/:uidb", FollowController.followController.findUserAFollowsUserB);
            app.delete("/api/follows", FollowController.followController.deleteAllFollows);
        }
        return FollowController.followController;
    }

    userAFollowsUserB = async (req: Request, res: Response, next: NextFunction) => {
        let userA, profile;
        try {
            profile = AuthenticationController.checkLogin(req);
            userA = await AuthenticationController.getUserId(req, profile);
        } catch (e) {
            next(e)
            return;
        }
        if (userA === MY) {
            next(new InvalidInputError("Admin account cannot create movie lists"))
            return;
        }
        const userB = req.params.uidb;
        if (!ObjectId.isValid(userA) || !ObjectId.isValid(userB)) {
            next(new InvalidInputError("Received invalid id"));
            return;
        }
        if (userA === userB) {
            next(new InvalidInputError("You cannot follow yourself."));
            return;
        }
        const userAProfile = await FollowController.userDao.findUserById(userA);
        const userBProfile = await FollowController.userDao.findUserById(userB)
        if (!userAProfile || !userBProfile) {
            next(new NoSuchUserError());
            return;
        }
        const userAAlreadyFollowsUserB = await FollowController.followDao.findUserAFollowsUserB(userA, userB);
        try {
            if (userAAlreadyFollowsUserB) {
                await FollowController.followDao.userAUnfollowsUserB(userA, userB);
            } else {
                await FollowController.followDao.userAFollowsUserB(userA, userB);
            }
        } catch (e) {
            next(e);
            return;
        }
        // update user A following
        // update user B follower
        try {
            userAProfile.stats.following = await FollowController.followDao.findHowManyFollowings(userA);
            await FollowController.userDao.updateUser(userA, userAProfile);
            userBProfile.stats.follower = await FollowController.followDao.findHowManyFollowers(userB);
            await FollowController.userDao.updateUser(userB, userBProfile);
        } catch (e) {
            next(e);
        }
        res.sendStatus(200);
    }

    findAllFollows = (req: Request, res: Response) => {
        FollowController.followDao.findAllFollows()
            .then(follows => res.json(follows));
    }

    deleteAllFollows = async (req: Request, res: Response, next: NextFunction) => {
        let profile;
        try {
            profile = AuthenticationController.checkLogin(req);
        } catch (e) {
            next(e);
            return
        }
        const isAdmin = await AuthenticationController.isAdmin(profile.username);
        if (isAdmin) {
            FollowController.followDao.deleteAllFollows()
                .then((status) => res.json(status));
        } else {
            next(new NoPermissionError());
        }
    }

    findFollowings = (req: Request, res: Response, next: NextFunction) => {
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
        FollowController.followDao.findFollowings(userId)
            .then((fs) => res.json(fs))
            .catch(next);
    }

    findFollowers = (req: Request, res: Response, next: NextFunction) => {
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
        FollowController.followDao.findFollowers(userId)
            .then((fs) => res.json(fs))
            .catch(next);
    }

    findUserAFollowsUserB = (req: Request, res: Response, next: NextFunction) => {
        let profile, userA;
        userA = req.params.uid;
        if (userA === MY) {
            try {
                profile = AuthenticationController.checkLogin(req);
                userA = profile._id;
            } catch (e) {
                next(e);
                return;
            }
        }
        const userB = req.params.uidb;
        if (!ObjectId.isValid(userA) || !ObjectId.isValid(userB)) {
            next(new InvalidInputError("Received invalid id"));
            return;
        }
        FollowController.followDao.findUserAFollowsUserB(userA, userB)
            .then(f => res.json(f))
            .catch(next);
    }

}