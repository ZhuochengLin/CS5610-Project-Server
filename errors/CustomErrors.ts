export class NoSuchUserError extends Error {

    constructor() {
        super("No such user.");
    }

}

export class NoUserLoggedInError extends Error {

    constructor() {
        super("Login expired.");
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

export class InvalidInputError extends Error {

    constructor(msg: string = "Received invalid input.") {
        super(msg);
    }

}

export class EmptyMovieListNameError extends Error {

    constructor() {
        super("Received empty movie list name.");
    }

}

export class MovieListAlreadyExistsError extends Error {

    constructor() {
        super("MovieStats list already exists.");
    }

}

export class MovieReviewAlreadyExistsError extends Error {

    constructor() {
        super("MovieStats review already exists.");
    }

}

export class NoSuchMovieListError extends Error {

    constructor() {
        super("No such movie list.");
    }

}

export class NoPermissionError extends Error {

    constructor(msg: string = "No permission on this operation.") {
        super(msg);
    }

}