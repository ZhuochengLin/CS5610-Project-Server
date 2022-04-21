import User from "./User";
import MovieReview from "./MovieReview";

export default interface ReviewLike {
    review: MovieReview;
    likedBy: User;
    postedOn: Date;
}