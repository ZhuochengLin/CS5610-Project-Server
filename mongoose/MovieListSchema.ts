import mongoose from "mongoose";
import MovieList from "../models/MovieList";

const MovieListSchema = new mongoose.Schema<MovieList>({
    ownedBy: {type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true},
    listName: {type: String, required: true},
    movies: [String],
    createdOn: {type: Date, default: Date.now}
}, {collection: "movie-lists"});
export default MovieListSchema;