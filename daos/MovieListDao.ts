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

    createMovieList = async (movieList: MovieList): Promise<MovieList> => {
        return MovieListModel.create(movieList);
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

    deleteMovieListById = async (lid: string): Promise<any> => {
        return MovieListModel.deleteOne({_id: lid});
    }

    deleteAllMovieLists = async (): Promise<any> => {
        return MovieListModel.deleteMany({});
    }

    updateMovieListById = async (lid: string, movieList: MovieList): Promise<any> => {
        return MovieListModel.updateOne({_id: lid}, {$set: movieList});
    }

    findAllMovieListsOwnedByUser = async (uid: string): Promise<MovieList[]> => {
        return MovieListModel.find({ownedBy: uid});
    }

    findMovieListOwnedByUser = async (uid: string, lid: string): Promise<MovieList | null> => {
        return MovieListModel.findOne({ownedBy: uid, _id: lid});
    }

    findAllMovieListsOwnedByUserByName = async (uid: string, lname: string): Promise<MovieList | null> => {
        return MovieListModel.findOne({ownedBy: uid, listName: lname});
    }

}

export default MovieListDao;