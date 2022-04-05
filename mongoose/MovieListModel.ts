import mongoose from "mongoose";
import MovieListSchema from "./MovieListSchema";

const MovieListModel = mongoose.model("MovieListModel", MovieListSchema);
export default MovieListModel;