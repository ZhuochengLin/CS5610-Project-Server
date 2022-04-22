import mongoose from "mongoose";
import MovieStats from "../models/MovieStats";

const MovieStatsSchema = new mongoose.Schema<MovieStats>({
    movieId: {type: String, required: true},
    stats: {
        likes: {type: Number, default: 0}
    }
}, {collection: "movie-stats"});
export default MovieStatsSchema;