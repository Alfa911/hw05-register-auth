import mongoose from "mongoose";
import {createError} from '../helpers/index'
import {Request, Response, NextFunction} from "express";

const {isValidObjectId} = mongoose;
const isValidId = (req: Request, res: Response, next: NextFunction) => {
    // const {id} = req.params;
    // if (!isValidObjectId(id)) {
    //     return next(createError(404))
    // }
    next();
}
export default isValidId;