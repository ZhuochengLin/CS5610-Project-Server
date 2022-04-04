export class NoSuchUserError extends Error {

    constructor() {
        super("No such user.");
    }

}

export class NoUserLoggedInError extends Error {

    constructor() {
        super("No user is logged in.");
    }

}

export class UserAlreadyExistsError extends Error {

    constructor() {
        super("User already exists.");
    }

}

export class IncorrectCredentialError extends Error {

    constructor() {
        super("Username and password do not match.");
    }

}

export class InvalidInputError extends Error {}
