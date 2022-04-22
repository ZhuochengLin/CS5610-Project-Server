import MovieStatsDao from "../daos/MovieStatsDao";
import {Express, NextFunction, Request, Response} from "express";

export default class MovieStatsController {

    private static movieStatsController : MovieStatsController | null = null;
    private static movieStatsDao: MovieStatsDao = MovieStatsDao.getInstance();

    private constructor() {
    }

    public static getInstance = (app: Express) => {
        if (MovieStatsController.movieStatsController === null) {
            MovieStatsController.movieStatsController = new MovieStatsController();
            app.get("/api/movie-stats/:mid", MovieStatsController.movieStatsController.findMovieStats);
        }
        return MovieStatsController.movieStatsController;
    }

    findMovieStats = (req: Request, res: Response, next: NextFunction) => {
        const movieId = req.params.mid;
        MovieStatsController.movieStatsDao
            .findMovieStats(movieId)
            .then(s => res.json(s)).catch(next);
    }

}