import mongoose from "mongoose";
import MovieReview from "../models/MovieReview";

const MovieReviewSchema = new mongoose.Schema<MovieReview>({
    movieId: {type: String, required: true},
    postedBy: {type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true},
    review: {type: String, required: true},
    rating: {type: Number, min: 0, max: 10, required: true},
    postedOn: {type: Date, default: Date.now},
    stats: {
        likes: {type: Number, default: 0}
    }
}, {collection: "movie-reviews"});

export default MovieReviewSchema;