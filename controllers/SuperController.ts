import SuperDao from "../daos/SuperDao";
import {Express, NextFunction, Request, Response} from "express";

export default class SuperController {

    private static superController: SuperController | null = null;
    private static superDao: SuperDao = SuperDao.getInstance();

    private constructor() {
    }

    public static getInstance = (app:Express) => {
        if (SuperController.superController === null) {
            SuperController.superController = new SuperController();
            app.get("/api/supers", SuperController.superController.findAllSupers);
        }
        return SuperController.superController;
    }

    findAllSupers = (req: Request, res: Response, next: NextFunction) => {
        SuperController.superDao.findAllSupers().then(s => res.json(s)).catch(next);
    }

}