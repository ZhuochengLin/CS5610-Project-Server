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
        return MovieListModel.findOne({listName: listName}).populate("ownedBy", ["username"]);
    }

    findAllMovieLists = async (): Promise<MovieList[]> => {
        return MovieListModel.find({}).sort({"createdOn": -1}).populate("ownedBy", ["username"]);
    }

    findMovieListById = async (lid: string): Promise<MovieList | null> => {
        return MovieListModel.findOne({_id: lid}).populate("ownedBy", ["username"]);
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
        return MovieListModel.find({ownedBy: uid}).sort({"createdOn": -1}).populate("ownedBy", ["username"]);
    }

    findMovieListOwnedByUser = async (uid: string, lid: string): Promise<MovieList | null> => {
        return MovieListModel.findOne({ownedBy: uid, _id: lid}).populate("ownedBy", ["username"]);
    }

    findMovieListOwnedByUserByName = async (uid: string, lname: string): Promise<MovieList | null> => {
        return MovieListModel.findOne({ownedBy: uid, listName: lname}).populate("ownedBy", ["username"]);
    }

}

export default MovieListDao;