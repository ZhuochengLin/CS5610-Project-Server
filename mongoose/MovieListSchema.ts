import mongoose from "mongoose";
import MovieList from "../models/MovieList";

const MovieListSchema = new mongoose.Schema<MovieList>({
    ownedBy: {type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true},
    listName: {type: String, required: true, unique: true},
    movies: [String]
}, {collection: "movie-lists"});
export default MovieListSchema;