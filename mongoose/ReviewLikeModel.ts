import mongoose from "mongoose";
import ReviewLikeSchema from "./ReviewLikeSchema";

const ReviewLikeModel = mongoose.model("ReviewLikeModel", ReviewLikeSchema);
export default ReviewLikeModel;