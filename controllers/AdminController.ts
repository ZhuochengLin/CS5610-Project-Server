import AdminDao from "../daos/AdminDao";
import {Express, NextFunction, Request, Response} from "express";
import AuthenticationController from "./AuthenticationController";
import {NoPermissionError, NoSuchUserError} from "../errors/CustomErrors";
import UserDao from "../daos/UserDao";

export default class AdminController {

    private static adminController: AdminController | null = null;
    private static adminDao: AdminDao = AdminDao.getInstance();
    private static userDao: UserDao = UserDao.getInstance();

    private constructor() {
    }

    public static getInstance = (app: Express) => {
        if (AdminController.adminController === null) {
            AdminController.adminController = new AdminController();
            app.get("/api/admins", AdminController.adminController.findAllAdmins);
            app.post("/api/admins/:uname", AdminController.adminController.createAdmin);
            app.delete("/api/admins/:uname", AdminController.adminController.deleteAdmin);
        }
        return AdminController.adminController;
    }

    createAdmin = async (req: Request, res: Response, next: NextFunction) => {
        let profile;
        try {
            profile = AuthenticationController.checkLogin(req);
        } catch (e) {
            next(e);
            return
        }
        const uname = req.params.uname;
        const isSuper = await AuthenticationController.isSuper(profile.username);
        if (isSuper) {
            try {
                const existingUser = await AdminController.userDao.findUserByUsername(uname);
                if (!existingUser) {
                    next(new NoSuchUserError());
                    return;
                }
                const existingAdmin = await AdminController.adminDao.findAdmin(uname);
                if (!existingAdmin) {
                    await AdminController.adminDao.createAdmin(uname);
                }
            } catch (e) {
                next(e);
                return;
            }
            res.sendStatus(200);
        } else {
            next(new NoPermissionError("Only Super can grant admin access."))
        }
    }

    deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
        let profile;
        try {
            profile = AuthenticationController.checkLogin(req);
        } catch (e) {
            next(e);
            return
        }
        const uname = req.params.uname;
        const isSuper = await AuthenticationController.isSuper(profile.username);
        if (isSuper) {
            try {
                await AdminController.adminDao.deleteAdmin(uname);
            } catch (e) {
                next(e);
                return;
            }
            res.sendStatus(200);
        } else {
            next(new NoPermissionError("Only Super can revoke admin access."))
        }
    }

    findAllAdmins = (req: Request, res: Response, next: NextFunction) => {
        AdminController.adminDao.findAllAdmins()
            .then(as => res.json(as))
            .catch(next);
    }

}