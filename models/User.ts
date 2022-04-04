export default interface User {
    username: string;
    password: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    profilePhoto?: string,
    biography?: string;
    dateOfBirth?: Date;
};