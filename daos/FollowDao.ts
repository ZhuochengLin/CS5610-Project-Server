import FollowModel from "../mongoose/FollowModel";
import {PUBLIC_FIELDS} from "../utils/constants";

export default class FollowDao {

    private static followDao: FollowDao | null = null;

    private constructor() {
    }

    public static getInstance = () => {
        if (FollowDao.followDao === null) {
            FollowDao.followDao = new FollowDao();
        }
        return FollowDao.followDao;
    }

    userAFollowsUserB = async (uida: string, uidb: string) => {
        return FollowModel.create({user: uidb, followedBy: uida});
    }

    userAUnfollowsUserB = async (uida: string, uidb: string) => {
        return FollowModel.deleteOne({user: uidb, followedBy: uida});
    }

    findAllFollows = async () => {
        return FollowModel.find().sort({"postedOn": -1}).populate("user", PUBLIC_FIELDS).populate("followedBy", PUBLIC_FIELDS);
    }

    deleteAllFollows = async () => {
        return FollowModel.deleteMany({});
    }

    findUserAFollowsUserB = async (uida: string, uidb: string) => {
        return FollowModel.findOne({user: uidb, followedBy: uida});
    }

    findHowManyFollowings = async (uid: string) => {
        return FollowModel.countDocuments({followedBy: uid});
    }

    findHowManyFollowers = (uid: string) => {
        return FollowModel.countDocuments({user: uid});
    }

    findFollowings = (uid: string) => {
        return FollowModel.find({followedBy: uid}).sort({"postedOn": -1}).populate("user", PUBLIC_FIELDS).populate("followedBy", PUBLIC_FIELDS);
    }

    findFollowers = (uid: string) => {
        return FollowModel.find({user: uid}).sort({"postedOn": -1}).populate("user", PUBLIC_FIELDS).populate("followedBy", PUBLIC_FIELDS);
    }
}