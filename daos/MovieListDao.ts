import MovieListModel from "../mongoose/MovieListModel";
import MovieList from "../models/MovieList";

class MovieListDao {

    private static movieListDao: MovieListDao | null = null;

    public static getInstance = () => {
        if (MovieListDao.movieListDao === null) {
            MovieListDao.movieListDao = new MovieListDao();
        }
        return MovieListDao.movieListDao;
    }

    private constructor() {
    }

    createMovieList = async (uid: string, listName: string, movies: string[]): Promise<MovieList> => {
        return MovieListModel.create({ownedBy: uid, listName: listName, movies: this.getUniqueMovies(movies)});
    }

    findMovieListByName = async (listName: string): Promise<MovieList | null> => {
        return MovieListModel.findOne({listName: listName});
    }

    findAllMovieLists = async (): Promise<MovieList[]> => {
        return MovieListModel.find({});
    }

    findMovieListById = async (lid: string): Promise<MovieList | null> => {
        return MovieListModel.findOne({_id: lid});
    }

    findMovieListByListName = async (lname: string): Promise<MovieList | null> => {
        return MovieListModel.findOne({listName: lname});
    }

    deleteMovieListById = async (lid: string): Promise<any> => {
        return MovieListModel.deleteOne({_id: lid});
    }

    deleteAllMovieLists = async (): Promise<any> => {
        return MovieListModel.deleteMany({});
    }

    updateMovieListById = async (lid: string, movies: string[]): Promise<any> => {
        return MovieListModel.updateOne({_id: lid}, {$set: {movies: this.getUniqueMovies(movies)}});
    }

    findMovieListsOwnedByUser = async (uid: string): Promise<MovieList[]> => {
        return MovieListModel.find({ownedBy: uid});
    }

    private getUniqueMovies = (movies: string[]) => {
        return [...new Set(movies.map((m: any) => m + ""))];
    }

}

export default MovieListDao;