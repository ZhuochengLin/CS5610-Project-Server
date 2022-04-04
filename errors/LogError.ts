import {NextFunction, Request, Response} from "express";

export function LogError(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    next(err);
}