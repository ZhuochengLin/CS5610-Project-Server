import UserDao from "../daos/UserDao";
import User from "../models/User";
import {Express, NextFunction, Request, Response} from "express";
import AuthenticationController from "./AuthenticationController";
import {InvalidInputError, NoPermissionError, NoSuchUserError, UserAlreadyExistsError} from "../errors/CustomErrors";
import {MY, PRIVATE_FIELDS} from "../utils/constants";

const ObjectId = require('mongoose').Types.ObjectId;

export default class UserController {
    private static userDao: UserDao = UserDao.getInstance();
    private static userController: UserController | null = null;

    public static getInstance = (app: Express): UserController => {
        if(UserController.userController === null) {
            UserController.userController = new UserController();
            app.get("/api/users",
                UserController.userController.findAllUsers);
            app.get("/api/users/:uid",
                UserController.userController.findUserById);
            app.post("/api/users",
                UserController.userController.createUser);
            app.put("/api/users/:uid",
                UserController.userController.updateUser);
            app.delete("/api/users/:uid",
                UserController.userController.deleteUser);
            app.delete("/api/users",
                UserController.userController.deleteAllUsers);
        }
        return UserController.userController;
    }

    private constructor() {}

    findAllUsers = (req: Request, res: Response) =>
        UserController.userDao.findAllUsers()
            .then((users: User[]) => {
                // remove private fields
                users = users.map(u => {
                    for (let privateField of PRIVATE_FIELDS) {
                        // @ts-ignore
                        if (u[privateField]) {
                            // @ts-ignore
                            u[privateField] = "";
                        }
                    }
                    return u;
                });
                res.json(users);
            });

    findUserById = (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.uid;
        if (!ObjectId.isValid(userId)) {
            next(new InvalidInputError("Received invalid id"));
            return;
        }
        UserController.userDao.findUserById(userId)
            .then((user) => {
                if (user) {
                    for (let privateField of PRIVATE_FIELDS) {
                        // @ts-ignore
                        if (user[privateField]) {
                            // @ts-ignore
                            user[privateField] = "";
                        }
                    }
                }
                res.json(user);
            })
            .catch(next);
    }

    createUser = async (req: Request, res: Response, next: NextFunction) => {
        let profile;
        try {
            profile = AuthenticationController.checkLogin(req);
        } catch (e) {
            next(e);
            return
        }
        const isAdmin = await AuthenticationController.isAdmin(profile.username);
        if (isAdmin) {
            UserController.userDao.createUser(req.body)
                .then((user: User) => res.json(user))
                .catch(next);
        } else {
            next(new NoPermissionError());
            return
        }
    }

    updateUser = async (req: Request, res: Response, next: NextFunction) => {
        let userId, profile;
        try {
            profile = AuthenticationController.checkLogin(req);
            userId = await AuthenticationController.getUserId(req, profile);
        } catch (e) {
            next(e)
            return;
        }
        if (userId === MY) {
            next(new InvalidInputError("Cannot update admin account."))
            return;
        }
        if (!ObjectId.isValid(userId)) {
            next(new InvalidInputError("Received invalid id"));
            return;
        }
        const data = req.body;
        // duplicate username
        if (data.username) {
            const existingUser = await UserController.userDao.findUserByUsername(data.username);
            if (existingUser && existingUser._id.toString() !== userId) {
                next(new UserAlreadyExistsError());
                return;
            }
        }
        UserController.userDao.updateUser(userId, data)
            .then((status) => res.send(status)).catch(next);
    }

    deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        let profile;
        try {
            profile = AuthenticationController.checkLogin(req);
        } catch (e) {
            next(e);
            return
        }
        const isAdmin = await AuthenticationController.isAdmin(profile.username);
        const userId = req.params.uid;
        if (userId === MY) {
            next(new InvalidInputError("Cannot delete admin account."))
            return;
        }
        if (isAdmin) {
            if (!ObjectId.isValid(userId)) {
                next(new InvalidInputError("Received invalid id"));
                return;
            }
            UserController.userDao.deleteUser(userId)
                .then((status) => res.send(status))
                .catch(next);
        } else {
            next(new NoPermissionError());
        }
    }

    deleteAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        let profile;
        try {
            profile = AuthenticationController.checkLogin(req);
        } catch (e) {
            next(e);
            return
        }
        const isAdmin = await AuthenticationController.isAdmin(profile.username);
        if (isAdmin) {
            UserController.userDao.deleteAllUsers()
                .then((status) => res.send(status));
        } else {
            next(new NoPermissionError());
        }
    }
};
