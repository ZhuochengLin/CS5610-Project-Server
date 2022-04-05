import express, {Request, Response} from "express";
import mongoose from "mongoose";
import {config} from "dotenv";
import {LogError} from "./errors/LogError";
import {ErrorHandler} from "./errors/ErrorHandler";
import UserController from "./controllers/UserController";
import MovieController from "./controllers/MovieController";
import AuthController from "./controllers/AuthController";
const cors = require("cors");
const session = require("express-session");

config();
const app = express();
mongoose.connect(`${process.env.DB_URI}`, (err) => {
    if (err) throw err;
    console.log("MongoDB connected!")
});

app.use(
    cors({credentials: true, origin: true})
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
const authController = AuthController.getInstance(app);

app.use(LogError);
app.use(ErrorHandler);
const PORT = 4000;
app.listen(process.env.PORT || PORT);
