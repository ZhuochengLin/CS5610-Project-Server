export default interface User {
    _id: string;
    username: string;
    password: string;
    joined: Date;
    email?: string;
    firstName?: string;
    lastName?: string;
    profilePhoto?: string;
    headerImage?: string;
    biography?: string;
    dateOfBirth?: Date;
    phone?: string;
    role?: string;
};