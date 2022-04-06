import {Express, NextFunction, Request, Response} from "express";
import {pipeline} from "stream";
import got from "got";
import {InvalidInputError} from "../errors/CustomErrors";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_MOVIE_BASE_URL = TMDB_BASE_URL + "/movie";

export default class MovieController {

    private static movieController: MovieController | null = null;

    public static getInstance = (app: Express) => {
        if (MovieController.movieController === null) {
            MovieController.movieController = new MovieController();
            app.get("/api/movies/popular/:page", MovieController.movieController.findPopularMovies)
            app.get("/api/movies/:mid", MovieController.movieController.findMovieDetails);
            app.get("/api/movies/nowplaying/:page", MovieController.movieController.findNowPlayingMovies);
            app.get("/api/movies/toprated/:page", MovieController.movieController.findTopRatedMovies);
            app.get("/api/movies/upcoming/:page", MovieController.movieController.findUpcomingMovies);
            app.get("/api/movies", MovieController.movieController.searchMovie);
        }
        return MovieController.movieController;
    }

    private constructor() {
    }

    findPopularMovies = async (req: Request, res: Response, next: NextFunction) => {
        let page = req.params.page;
        const dataStream = got.stream.get(
            `${TMDB_MOVIE_BASE_URL}/popular`,
            {searchParams: {api_key: process.env.TMDB_API_KEY, page: page}}
        );
        pipeline(dataStream, res, (err) => {
            if (err) next(err)
        });
    }

    findMovieDetails = async (req: Request, res: Response, next: NextFunction) => {
        const dataStream = got.stream.get(
            `${TMDB_MOVIE_BASE_URL}/${req.params.mid}`,
            {searchParams: {api_key: process.env.TMDB_API_KEY}}
        );
        pipeline(dataStream, res, (err) => {
            if (err) next(err)
        });
    }

    findNowPlayingMovies = async (req: Request, res: Response, next: NextFunction) => {
        let page = req.params.page;
        const dataStream = got.stream.get(
            `${TMDB_MOVIE_BASE_URL}/now_playing`,
            {searchParams: {api_key: process.env.TMDB_API_KEY, page: page}}
        );
        pipeline(dataStream, res, (err) => {
            if (err) next(err)
        });
    }

    findTopRatedMovies = async (req: Request, res: Response, next: NextFunction) => {
        let page = req.params.page;
        const dataStream = got.stream.get(
            `${TMDB_MOVIE_BASE_URL}/top_rated`,
            {searchParams: {api_key: process.env.TMDB_API_KEY, page: page}}
        );
        pipeline(dataStream, res, (err) => {
            if (err) next(err)
        });
    }

    findUpcomingMovies = async (req: Request, res: Response, next: NextFunction) => {
        const page = req.params.page;
        const dataStream = got.stream.get(
            `${TMDB_MOVIE_BASE_URL}/upcoming`,
            {searchParams: {api_key: process.env.TMDB_API_KEY, page: page}}
        );
        pipeline(dataStream, res, (err) => {
            if (err) next(err)
        });
    }

    searchMovie = async (req: Request, res: Response, next: NextFunction) => {
        const movie = req.query.movie;
        const page = req.query.page;
        if (!movie || !page) {
            next(new InvalidInputError("Please provide {movie} and {page} parameters."));
            return
        }
        const dataStream = got.stream.get(
            `${TMDB_BASE_URL}/search/movie`,
            // @ts-ignore
            {searchParams: {api_key: process.env.TMDB_API_KEY, query: movie, page: page}}
        );
        pipeline(dataStream, res, (err) => {
            if (err) next(err)
        });
    }
}