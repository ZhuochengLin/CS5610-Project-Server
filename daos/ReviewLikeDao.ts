import ReviewLikeModel from "../mongoose/ReviewLikeModel";
import {PUBLIC_FIELDS} from "../utils/constants";

export default class ReviewLikeDao {

    private static likeDao: ReviewLikeDao | null = null;

    private constructor() {
    }

    public static getInstance = () => {
        if (ReviewLikeDao.likeDao === null) {
            ReviewLikeDao.likeDao = new ReviewLikeDao();
        }
        return ReviewLikeDao.likeDao;
    }

    userLikesReview = async (uid: string, rid: string) => {
        return ReviewLikeModel.create({likedBy: uid, review: rid})
    }

    userUnLikesReview = async (uid: string, rid: string) => {
        return ReviewLikeModel.deleteOne({likedBy: uid, review: rid});
    }

    findAllLikes = async () => {
        return ReviewLikeModel.find().sort({"postedOn": -1}).populate({path: "review", populate: {path: "postedBy", select: PUBLIC_FIELDS}}).populate("likedBy", PUBLIC_FIELDS);
    }

    deleteAllLikes = async () => {
        return ReviewLikeModel.deleteMany({});
    }

    findUserLikesReview = async (uid: string, rid: string) => {
        return ReviewLikeModel.findOne({likedBy: uid, review: rid}).populate({path: "review", populate: {path: "postedBy", select: PUBLIC_FIELDS}}).populate("likedBy", PUBLIC_FIELDS);
    }

    findAllReviewsLikedByUser = async (uid: string) => {
        return ReviewLikeModel.find({likedBy: uid}).sort({"postedOn": -1}).populate({path: "review", populate: {path: "postedBy", select: PUBLIC_FIELDS}}).populate("likedBy", PUBLIC_FIELDS);
    }

    findHowManyLikesOfReview = async (rid: string) => {
        return ReviewLikeModel.countDocuments({review: rid});
    }

}