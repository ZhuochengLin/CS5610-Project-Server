import {Express, NextFunction, Request, Response} from "express";
import UserDao from "../daos/UserDao";
import {
    UserAlreadyExistsError,
    InvalidInputError,
    NoUserLoggedInError,
    IncorrectCredentialError, NoSuchUserError
} from "../errors/CustomErrors";
import AdminDao from "../daos/AdminDao";
import User from "../models/User";
import {ADMIN, MY, SUPER, USER} from "../utils/constants";
import SuperDao from "../daos/SuperDao";

const bcrypt = require('bcrypt');

export default class AuthenticationController {

    private static authenticationController: AuthenticationController | null = null;
    private static userDao: UserDao = UserDao.getInstance();
    private static adminDao: AdminDao = AdminDao.getInstance();
    private static superDao: SuperDao = SuperDao.getInstance();

    public static getInstance = (app: Express) => {
        if (AuthenticationController.authenticationController === null) {
            AuthenticationController.authenticationController = new AuthenticationController();
            app.post("/api/auth/login", AuthenticationController.authenticationController.login);
            app.post("/api/auth/register", AuthenticationController.authenticationController.register);
            app.post("/api/auth/profile", AuthenticationController.authenticationController.profile);
            app.post("/api/auth/logout", AuthenticationController.authenticationController.logout);
        }
        return AuthenticationController.authenticationController;
    }

    login = async (req: Request, res: Response, next: NextFunction) => {

        console.log("==> login")
        console.log("==> req.session")

        const user = req.body;
        if (!user.username || !user.password) {
            next(new IncorrectCredentialError());
            return;
        }
        const username = user.username;
        const password = user.password;
        const role = user.role;
        const existingUser = await AuthenticationController.userDao
            .findUserByUsername(username);
        if (!existingUser) {
            next(new IncorrectCredentialError())
            return;
        }
        const match = await bcrypt.compare(password, existingUser.password);
        if (match) {
            if (role === ADMIN && !await AuthenticationController.isAdmin(username)) {
                next(new IncorrectCredentialError());
                return;
            }
            if (role === SUPER && !await AuthenticationController.isSuper(username)) {
                next(new IncorrectCredentialError());
                return;
            }
            existingUser.password = "";
            existingUser.role = role === ADMIN || role === SUPER ? role : USER;
            // @ts-ignore
            req.session['profile'] = existingUser;
            // @ts-ignore
            console.log(req.session)
            res.json(existingUser);
        } else {
            next(new IncorrectCredentialError());
        }
    }

    register = async (req: Request, res: Response, next: NextFunction) => {
        console.log("==> register")
        console.log("==> req.session")

        const newUser = req.body;
        if (!newUser.username || !newUser.password) {
            next(new InvalidInputError("No username or password"));
            return
        }
        const existingUser = await AuthenticationController.userDao
            .findUserByUsername(req.body.username);
        if (existingUser) {
            next(new UserAlreadyExistsError());
            return;
        }
        const insertedUser = await AuthenticationController.userDao
            .createUser(newUser);
        insertedUser.password = "";
        insertedUser.role = USER;
        // @ts-ignore
        req.session['profile'] = insertedUser;
        // @ts-ignore
        console.log(req.session)
        res.json(insertedUser);
    }

    profile = async (req: Request, res: Response, next: NextFunction) => {
        // @ts-ignore
        let profile = req.session['profile'];
        if (profile) {
            // if logged in
            const userId = profile._id;
            const updatedUser = await AuthenticationController.userDao.findUserById(userId);
            if (updatedUser) {
                updatedUser.password = "";
                updatedUser.role = profile.role;
                // @ts-ignore
                req.session['profile'] = updatedUser;
                // @ts-ignore
                profile = req.session['profile'];
            } else {
                next(new NoSuchUserError());
                return;
            }
            res.json(profile);
        } else {
            next(new NoUserLoggedInError());
        }
    }

    logout = (req: Request, res: Response) => {
        // @ts-ignore
        req.session.destroy();
        res.sendStatus(200);
    }

    public static checkLogin = (req: Request): User => {
        // @ts-ignore
        const profile = req.session["profile"];
        if (!profile) {
            throw new NoUserLoggedInError();
        }
        return profile;
    }

    public static getUserId = async (req: Request, profile: User): Promise<string> => {
        const isAdmin = await AuthenticationController.adminDao.findAdmin(profile.username);
        if (isAdmin && req.params.uid !== MY) {
            return req.params.uid;
        } else {
            return profile._id;
        }
    }

    public static isAdmin = async (uname: string): Promise<boolean> => {
        const isAdmin = await AuthenticationController.adminDao.findAdmin(uname);
        return !!isAdmin;
    }

    public static isSuper = async (uname: string): Promise<boolean> => {
        const isSuper = await AuthenticationController.superDao.findSuper(uname);
        return !!isSuper;
    }

};