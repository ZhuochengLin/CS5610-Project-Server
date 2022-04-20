import {Express, NextFunction, Request, Response} from "express";
import {NoPermissionError} from "../errors/CustomErrors";
import CloudinaryDao from "../daos/CloudinaryDao";
import {HEADER_IMAGE_FIELD, PROFILE_PHOTO_FIELD, IMAGE_FIELD, VIDEO_FIELD} from "../utils/constants";
import UserDao from "../daos/UserDao";
import AuthenticationController from "./AuthenticationController";

export default class CloudinaryController {

    private static cloudinaryController: CloudinaryController | null = null;
    private static cloudinaryDao: CloudinaryDao = CloudinaryDao.getInstance();
    private static userDao: UserDao = UserDao.getInstance();

    public static getInstance = (app: Express) => {
        if (CloudinaryController.cloudinaryController === null) {
            CloudinaryController.cloudinaryController = new CloudinaryController();
            app.get("/api/cloudinary/media", CloudinaryController.cloudinaryController.findAllCloudMedia);
            app.delete("/api/cloudinary/media", CloudinaryController.cloudinaryController.deleteTrashMedia);
        }
        return CloudinaryController.cloudinaryController;
    }

    private constructor() {
    }

    findAllCloudMedia = async (req: Request, res: Response, next: NextFunction) => {
        return CloudinaryController.cloudinaryDao.findCloudMedia()
            .then(media => res.json(media))
            .catch(next);
    }

    deleteTrashMedia = async (req: Request, res: Response, next: NextFunction) => {
        let profile;
        try {
            profile = AuthenticationController.checkLogin(req);
        } catch (e) {
            next(e);
            return
        }
        const isAdmin = await AuthenticationController.isAdmin(profile.username);
        if (isAdmin) {
            const localMedia = await this.findAllLocalMedia();
            const cloudMedia = await CloudinaryController.cloudinaryDao.findCloudMedia();
            const trashImageIds = [];
            const trashVideoIds = [];
            // image
            // @ts-ignore
            for (const m of cloudMedia[IMAGE_FIELD]) {
                // @ts-ignore
                if (localMedia.has(m.public_id)) {
                    continue;
                }
                // @ts-ignore
                trashImageIds.push(m.public_id);
            }
            // video
            // @ts-ignore
            for (const m of cloudMedia[VIDEO_FIELD]) {
                // @ts-ignore
                if (localMedia.has(m.public_id)) {
                    continue;
                }
                // @ts-ignore
                trashVideoIds.push(m.public_id);
            }
            try {
                // TODO: add delete result report
                if (trashImageIds.length > 0) {
                    await CloudinaryController.cloudinaryDao.deleteImages(trashImageIds);
                }
                if (trashVideoIds.length > 0) {
                    await CloudinaryController.cloudinaryDao.deleteVideos(trashVideoIds);
                }
                res.sendStatus(200);
            } catch (e) {
                next(e);
            }
        } else {
            next(new NoPermissionError());
        }
    }

    private findAllLocalMedia = async (): Promise<Set<any>> => {
        const localMedia = new Set();
        // user
        const users = await CloudinaryController.userDao.findAllUsers();
        for (const u of users) {
            localMedia.add(u[HEADER_IMAGE_FIELD]);
            localMedia.add(u[PROFILE_PHOTO_FIELD]);
        }
        return localMedia;
    }


}