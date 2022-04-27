import mongoose from "mongoose";
import MovieLikeSchema from "./MovieLikeSchema";

const MovieLikeModel = mongoose.model("MovieLikeModel", MovieLikeSchema);
export default MovieLikeModel;