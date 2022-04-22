import express, {Request, Response} from "express";
import mongoose from "mongoose";
import {config} from "dotenv";
import {LogError} from "./errors/LogError";
import {ErrorHandler} from "./errors/ErrorHandler";
import UserController from "./controllers/UserController";
import MovieController from "./controllers/MovieController";
import AuthenticationController from "./controllers/AuthenticationController";
import MovieListController from "./controllers/MovieListController";
import MovieReviewController from "./controllers/MovieReviewController";
import CloudinaryController from "./controllers/CloudinaryController";
import ReviewLikeController from "./controllers/ReviewLikeController";
import FollowController from "./controllers/FollowController";
import AdminController from "./controllers/AdminController";
import SuperController from "./controllers/SuperController";
import MovieLikeController from "./controllers/MovieLikeController";
import MovieStatsController from "./controllers/MovieStatsController";
const cors = require("cors");
const session = require("express-session");

config();
mongoose.connect(`${process.env.DB_URI}`, (err) => {
    if (err) throw err;
    console.log("MongoDB connected!")
});
const cloudinary = require("cloudinary");
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});
console.log("Cloudinary configured!");

const app = express();
app.use(
    cors({
        credentials: true,
        origin: true
    })
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
const movieReviewController = MovieReviewController.getInstance(app);
const cloudinaryController = CloudinaryController.getInstance(app);
const reviewLikeController = ReviewLikeController.getInstance(app);
const followController = FollowController.getInstance(app);
const adminController = AdminController.getInstance(app);
const superController = SuperController.getInstance(app);
const movieLikeController = MovieLikeController.getInstance(app);
const movieStatsController = MovieStatsController.getInstance(app);

app.use(LogError);
app.use(ErrorHandler);
const PORT = 4000;
app.listen(process.env.PORT || PORT);
