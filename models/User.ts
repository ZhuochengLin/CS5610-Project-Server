export default interface User {
    _id: string;
    username: string;
    password: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    profilePhoto?: string,
    biography?: string;
    dateOfBirth?: Date;
};