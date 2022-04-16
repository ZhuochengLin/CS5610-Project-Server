import User from "./User";

export default interface MovieList {
    ownedBy: User;
    listName: string;
    movies: string[];
    createdOn: Date;
}