import User from "./User";

export default interface Follow {
    user: User;
    followedBy: User;
    postedOn: Date;
}