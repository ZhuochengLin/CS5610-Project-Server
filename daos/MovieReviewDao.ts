import MovieReview from "../models/MovieReview";
import MovieReviewModel from "../mongoose/MovieReviewModel";

export default class MovieReviewDao {

    private static movieReviewDao: MovieReviewDao | null = null;

    private constructor() {
    }

    public static getInstance = () => {
        if (MovieReviewDao.movieReviewDao === null) {
            MovieReviewDao.movieReviewDao = new MovieReviewDao();
        }
        return MovieReviewDao.movieReviewDao;
    }

    createReview = async (movieReview: MovieReview): Promise<MovieReview> => {
        return MovieReviewModel.create(movieReview);
    }

    findAllReviews = async (): Promise<MovieReview[]> => {
        return MovieReviewModel.find().populate("postedBy", ["username"]);
    }

    deleteAllReviews = async (): Promise<any> => {
        return MovieReviewModel.deleteMany({});
    }

    deleteReviewById = async (rid: string): Promise<any> => {
        return MovieReviewModel.deleteOne({_id: rid});
    }

    findReviewOwnedByUsr = async (uid: string, rid: string): Promise<MovieReview | null> => {
        return MovieReviewModel.findOne({_id: rid, postedBy: uid}).populate("postedBy", ["username"]);
    }

    findAllReviewsOwnedByUser = async (uid: string): Promise<MovieReview[]> => {
        return MovieReviewModel.find({postedBy: uid}).populate("postedBy", ["username"]);
    }

    findReviewOnMovieOwnedByUsr = async (uid: string, mid: string): Promise<MovieReview | null> => {
        return MovieReviewModel.findOne({postedBy: uid, movieId: mid});
    }

    updateMovieReview = async (rid: string, newReview: MovieReview): Promise<any> => {
        return MovieReviewModel.updateOne({_id: rid}, {$set: newReview});
    }

    findAllReviewsOfMovie = async (mid: string): Promise<MovieReview[]> => {
        return MovieReviewModel.find({movieId: mid}).populate("postedBy", ["username"]);
    }
}