import mongoose from "mongoose";
import MovieStatsSchema from "./MovieStatsSchema";

const MovieStatsModel = mongoose.model("MovieStatsModel", MovieStatsSchema);
export default MovieStatsModel;
