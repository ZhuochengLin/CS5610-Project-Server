import mongoose from "mongoose";
import MovieReview from "../models/MovieReview";

const MovieReviewSchema = new mongoose.Schema<MovieReview>({
    movieId: {type: String, required: true},
    postedBy: {type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true},
    review: {type: String, required: true},
    rating: {type: Number, min: 0, max: 10, default: 5},
    createdOn: {type: Date, default: Date.now}
}, {collection: "movie-reviews"});

export default MovieReviewSchema;