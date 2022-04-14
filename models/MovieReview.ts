import User from "./User";

export default interface MovieReview {
    movieId: string;
    postedBy: User;
    review: string;
    rating: number;
}