import express from "express";
import { PORT } from "./config.js";
import userRouter from "./routes/users.routers.js";
//import morgan from "morgan";

const app = express();

app.disable('x-powered-by')
//app.use(morgan("dev"))
app.use(express.json());
app.use(userRouter);

app.listen(PORT);
console.log(`Server en http://localhost:${PORT}/`);
