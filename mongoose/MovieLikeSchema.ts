import mongoose from "mongoose";
import MovieLike from "../models/MovieLike";

const MovieLikeSchema = new mongoose.Schema<MovieLike>({
    movieId: {type: String, required: true},
    likedBy: {type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true},
    postedOn: {type: Date, default: Date.now}
}, {collection: "movie-likes"});
export default MovieLikeSchema;