import createError from '../helpers/createError';
import User, {IUser} from '../models/user';
import {Request, Response} from "express";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import IRequest from "../types/request";
import 'dotenv/config';

const {SECRET_JWT = ''} = process.env;

type controllerIUser = {
    register: (req: Request, res: Response) => Promise<void | never>
    login: (req: Request, res: Response) => Promise<void | never>
    current: (req: IRequest, res: Response) => Promise<void | never>
    logout: (req: IRequest, res: Response) => Promise<void | never>
}
let controllerUser: controllerIUser = {
    register: async (req: Request, res: Response): Promise<void | never> => {
        const {name, email, phone, passport, birthday, password, repeatPassword} = req.body;
        const user: IUser | null = await User.findOne({email});
        if (user) {
            throw createError(409, "User already register");
        }
        if (password !== repeatPassword) {
            throw createError(400, "password and passwordRepeat should be the same");
        }
        const hashPassword = bcrypt.hashSync(password, 8);
        const registerUser = await User.create({name, email, password: hashPassword, phone, passport, birthday});
        res.status(201).json({name: registerUser.name, email: registerUser.email})
    },
    login: async (req: Request, res: Response): Promise<void | never> => {
        const {email, password} = req.body;
        let user = await User.findOne({email});
        if (!user) {
            throw createError(401);
        }
        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            throw createError(401);
        }
        const payload = {id: user._id};
        const token = jwt.sign(payload, SECRET_JWT, {expiresIn: '1h'});
        await User.updateOne({'_id': user.id}, {token: token});
        res.json({token})
    },
    current: async (req: IRequest, res: Response): Promise<void | never> => {
        const {name, email} = req.user;
        res.json({name, email})
    },
    logout: async (req: IRequest, res: Response): Promise<void | never> => {
        const {id} = req.user;
        await User.findOneAndUpdate({"_id": id}, {token: ""});
        res.json({"message": "Success logout"})

    }

};


export default controllerUser;