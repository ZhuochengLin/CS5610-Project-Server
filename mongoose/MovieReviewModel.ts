import mongoose from "mongoose";
import MovieReviewSchema from "./MovieReviewSchema";

const MovieReviewModel = mongoose.model("MovieReviewModel", MovieReviewSchema);
export default MovieReviewModel;