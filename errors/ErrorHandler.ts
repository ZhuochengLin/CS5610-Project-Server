import {NextFunction, Request, Response} from "express";

export function ErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    res.status(403).send(err.message);
}