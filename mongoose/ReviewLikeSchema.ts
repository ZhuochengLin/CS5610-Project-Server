import mongoose from "mongoose";
import ReviewLike from "../models/ReviewLike";

const ReviewLikeSchema = new mongoose.Schema<ReviewLike>({
    review: {type: mongoose.Schema.Types.ObjectId, ref: "MovieReviewModel", required: true},
    likedBy: {type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true},
    postedOn: {type: Date, default: Date.now}
}, {collection: "review-likes"});
export default ReviewLikeSchema;