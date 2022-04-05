import {Express, NextFunction, Request, Response} from "express";
import {
    IncorrectCredentialError,
    InvalidInputError,
    NoUserLoggedInError,
    UserAlreadyExistsError
} from "../errors/CustomErrors";
import UserDao from "../daos/UserDao";

const bcrypt = require('bcrypt');
const saltRounds = 10;

class AuthController {

    private static authController: AuthController | null = null;
    private static userDao: UserDao = new UserDao();

    public static getInstance = (app: Express) => {
        if (AuthController.authController === null) {
            AuthController.authController = new AuthController();
            app.post("/api/auth/register", AuthController.authController.register);
            app.post("/api/auth/profile", AuthController.authController.profile);
            app.post("/api/auth/login", AuthController.authController.login);
            app.post("/api/auth/logout", AuthController.authController.logout);
        }
        return AuthController.authController;
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        console.log("==> login")
        const user = req.body;
        if (!user.username || !user.password) {
            next(new IncorrectCredentialError());
            return;
        }
        const username = user.username;
        const password = user.password;
        const existingUser = await AuthController.userDao
            .findUserByUsername(username);
        if (!existingUser) {
            next(new IncorrectCredentialError());
            return;
        }
        const match = await bcrypt.compare(password, existingUser.password);
        if (match) {
            existingUser.password = '******';
            // @ts-ignore
            req.session['profile'] = existingUser;
            // @ts-ignore
            console.log(req.session);
            res.json(existingUser);
        } else {
            next(new IncorrectCredentialError());
        }
    }

    register = async (req: Request, res: Response, next: NextFunction) => {
        console.log("==> register")
        const newUser = req.body;
        if (!newUser.username || !newUser.password) {
            next(new InvalidInputError("No username or password"));
            return
        }
        const password = newUser.password;
        newUser.password = await bcrypt.hash(password, saltRounds);

        const existingUser = await AuthController.userDao
            .findUserByUsername(req.body.username);
        if (existingUser) {
            next(new UserAlreadyExistsError());
            return;
        }
        const insertedUser = await AuthController.userDao
            .createUser(newUser);
        insertedUser.password = '******';
        // @ts-ignore
        req.session['profile'] = insertedUser;
        // @ts-ignore
        console.log(req.session);
        res.json(insertedUser);
    }

    profile = async (req: Request, res: Response, next: NextFunction) => {
        // @ts-ignore
        const profile = req.session['profile'];
        if (profile) {
            res.json(profile);
        } else {
            next(new NoUserLoggedInError());
        }
    }

    logout = async (req: Request, res: Response) => {
        // @ts-ignore
        req.session.destroy();
        res.sendStatus(200);
    }

}

export default AuthController;