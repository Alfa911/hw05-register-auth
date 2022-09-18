import {Request} from "express";
import {IUser} from "../models/user";

export default interface IRequest extends Request {
    user: IUser;
}
