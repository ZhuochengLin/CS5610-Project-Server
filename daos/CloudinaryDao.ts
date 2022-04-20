const cloudinary = require('cloudinary').v2;
import {IMAGE_FIELD, VIDEO_FIELD} from "../utils/constants";

export default class CloudinaryDao {

    private static cloudinaryDao: CloudinaryDao | null = null;
    private static cloudinaryAPI = cloudinary.api;

    public static getInstance = () => {
        if (CloudinaryDao.cloudinaryDao === null) {
            CloudinaryDao.cloudinaryDao = new CloudinaryDao();
        }
        return CloudinaryDao.cloudinaryDao;
    }

    findCloudMedia = async (): Promise<{}> => {
        const media = {};
        // @ts-ignore
        media[IMAGE_FIELD] = await this.findCloudImages();
        // @ts-ignore
        media[VIDEO_FIELD] = await this.findCloudVideos();
        return  media;
    }

    findCloudImages = async (): Promise<[]> => {
        return CloudinaryDao.cloudinaryAPI.resources().then((res: { resources: any; }) => res.resources);
    }

    findCloudVideos = async (): Promise<[]> => {
        return CloudinaryDao.cloudinaryAPI.resources({resource_type: "video"}).then((res: { resources: any; }) => res.resources);
    }

    deleteImages = async (publicIds: string[]): Promise<any> => {
        return CloudinaryDao.cloudinaryAPI.delete_resources(publicIds);
    }

    deleteVideos = async (publicIds: string[]): Promise<any> => {
        return CloudinaryDao.cloudinaryAPI.delete_resources(publicIds, {resource_type: "video"});
    }

}