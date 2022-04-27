import {NextFunction, Request, Response} from "express";
import {NoUserLoggedInError} from "./CustomErrors";

export function ErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof NoUserLoggedInError) {
        res.status(401).send({success: false, error: err.message});
    } else {
        res.status(403).send({success: false, error: err.message});
    }
}