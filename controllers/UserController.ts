import UserDao from "../daos/UserDao";
import {Express, NextFunction, Request, Response} from "express";
import User from "../models/User";

class UserController {

    private static userDao: UserDao = UserDao.getInstance();
    private static userController: UserController | null = null;

    public static getInstance = (app: Express): UserController => {
        if(UserController.userController === null) {
            UserController.userController = new UserController();
            app.get("/api/users", UserController.userController.findAllUsers);
            app.get("/api/users/:uid", UserController.userController.findUserById);
            app.post("/api/users", UserController.userController.createUser);
            app.delete("/api/users/:uid", UserController.userController.deleteUserById);
            app.delete("/api/users", UserController.userController.deleteAllUsers);
            app.put("/api/users/:uid", UserController.userController.updateUser);
        }
        return UserController.userController;
    }

    private constructor() {}

    createUser = (req: Request, res: Response, next: NextFunction) => {
        return UserController.userDao.createUser(req.body)
            .then((user: User) => res.json(user))
            .catch(next);
    }

    findAllUsers = (req: Request, res: Response) => {
        return UserController.userDao.findAllUsers()
            .then((users) => res.json(users));
    }

    findUserById = (req: Request, res: Response, next: NextFunction) => {
        return UserController.userDao.findUserById(req.params.uid)
            .then((user) => res.json(user))
            .catch(next);
    }

    deleteUserById = (req: Request, res: Response, next: NextFunction) => {
        return UserController.userDao.deleteUserById(req.params.uid)
            .then((status) => res.json(status))
            .catch(next);
    }

    deleteAllUsers = (req: Request, res: Response) => {
        return UserController.userDao.deleteAllUsers()
            .then((status) => res.json(status))
    }

    updateUser = (req: Request, res: Response, next: NextFunction) => {
        return UserController.userDao.updateUser(req.params.uid, req.body)
            .then((status) => res.json(status))
            .catch(next);
    }

}
export default UserController;