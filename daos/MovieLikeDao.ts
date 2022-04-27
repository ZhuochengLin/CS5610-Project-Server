import MovieLikeModel from "../mongoose/MovieLikeModel";

export default class MovieLikeDao {

    private static movieLikeDao: MovieLikeDao | null = null;

    private constructor() {
    }

    public static getInstance = () => {
        if (MovieLikeDao.movieLikeDao === null) {
            MovieLikeDao.movieLikeDao = new MovieLikeDao();
        }
        return MovieLikeDao.movieLikeDao;
    }

    userLikesMovie = async (uid: string, mid: string) => {
        return MovieLikeModel.create({movieId: mid, likedBy: uid});
    }

    userUnlikesMovie = async (uid: string, mid: string) => {
        return MovieLikeModel.deleteOne({movieId: mid, likedBy: uid});
    }

    findAllLikes = async () => {
        return MovieLikeModel.find();
    }

    findAllMoviesLikedByUser = async (uid: string) => {
        return MovieLikeModel.find({likedBy: uid}).sort({"postedOn": -1});
    }

    findUserLikesMovie = async (uid: string, mid: string) => {
        return MovieLikeModel.findOne({movieId: mid, likedBy: uid});
    }

    deleteAllLikes = async () => {
        return MovieLikeModel.deleteMany({});
    }

    findHowManyLikesOfMovie = async (mid: string) => {
        return MovieLikeModel.countDocuments({movieId: mid});
    }

}