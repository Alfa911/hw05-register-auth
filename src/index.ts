import express, {Request, Response, NextFunction} from "express";
import mongoose from "mongoose";
import cors from "cors";
import contactsRouter from './routes/api/contacts';
import userRoute from './routes/api/user';
import 'dotenv/config';

const {HOST_DB = "mongodb+srv://127.0.0.1/db", API_PORT = 3000} = process.env;
const app = express();

interface ErrorStatus extends Error {
    status?: number,
    kind?: string,
    value?: string,
    path?: string,
}

app.use(cors());
app.use(express.json());
app.use('/api', userRoute);
app.use('/api/contacts', contactsRouter);
app.use((error: ErrorStatus, req: Request, res: Response, next: NextFunction) => {
    let {message = "Unknown error", status = 500} = error;
    if (error.name === 'CastError') {
        const {kind = "", path = "", value = "unknown"} = error;
        message = `Invalid ${path}: ${value} need to be '${kind}'`;
        status = 400;
    } else if (error.name === 'MongoServerError') {
        status = 409;
    }
    res.status(status).json({message: message});
});

mongoose.connect(HOST_DB).then(() => {
    app.listen(API_PORT, () => console.log('Running on ' + API_PORT));
}).catch((e) => {
    console.error(e);
    process.exit(1)
});
