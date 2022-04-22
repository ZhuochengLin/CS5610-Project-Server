import MovieStatsModel from "../mongoose/MovieStatsModel";

export default class MovieStatsDao {

    private static movieDao: MovieStatsDao | null = null;

    private constructor() {
    }

    public static getInstance = () => {
        if (MovieStatsDao.movieDao === null) {
            MovieStatsDao.movieDao = new MovieStatsDao();
        }
        return MovieStatsDao.movieDao;
    }

    createMovieStats = async (movieId: string) => {
        return MovieStatsModel.create({movieId: movieId})
    }

    findMovieStats = async (movieId: string) => {
        return MovieStatsModel.findOne({movieId: movieId});
    }

    updateMovieStats = async (movieId: string, newStats: any) => {
        return MovieStatsModel.update({movieId: movieId}, {$set: newStats});
    }

}