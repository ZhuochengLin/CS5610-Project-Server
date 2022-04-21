import User from "./User";

export default interface MovieReview {
    postedBy: User;
    movieId: string;
    review: string;
    rating: number;
    postedOn: Date;
    stats: {
        likes: number;
    }
}