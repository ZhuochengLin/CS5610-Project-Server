import express, {Request, Response} from "express";

const app = express();
app.use(express.json());
app.get("/hello", (req: Request, res: Response) => res.send("Hello World!"));

const PORT = 4000;
app.listen(process.env.PORT || PORT);
