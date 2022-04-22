import User from "./User";

export default interface MovieLike {
    movieId: string;
    likedBy: User;
    postedOn: Date;
}