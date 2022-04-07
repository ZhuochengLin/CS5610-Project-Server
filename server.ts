import express, {Request, Response} from "express";
import mongoose from "mongoose";
import {config} from "dotenv";
import {LogError} from "./errors/LogError";
import {ErrorHandler} from "./errors/ErrorHandler";
import UserController from "./controllers/UserController";
import MovieController from "./controllers/MovieController";
import AuthenticationController from "./controllers/AuthenticationController";
import MovieListController from "./controllers/MovieListController";
const cors = require("cors");
const session = require("express-session");

config();
mongoose.connect(`${process.env.DB_URI}`, (err) => {
    if (err) throw err;
    console.log("MongoDB connected!")
});

const app = express();
app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:3000", "https://cs5610-project-client.netlify.app/"]})
);
let sess = {
    secret: process.env.EXPRESS_SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
        secure: process.env.NODE_ENV === "production",
    }
}
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1) // trust first proxy
}
app.use(session(sess))
app.use(express.json());

app.get("/", (req: Request, res: Response) => res.send("Welcome to CS5610!"));

const userController = UserController.getInstance(app);
const movieController = MovieController.getInstance(app);
const authController = AuthenticationController.getInstance(app);
const movieListController = MovieListController.getInstance(app);

app.use(LogError);
app.use(ErrorHandler);
const PORT = 4000;
app.listen(process.env.PORT || PORT);
