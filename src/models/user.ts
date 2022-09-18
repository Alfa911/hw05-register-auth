import mongoose from "mongoose";
import {Document} from "mongoose";
import Joi from "joi";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    token: string;
    phone: string;
    passport: string;
    birthday: string;

}

const {Schema, model} = mongoose;

const emailRegex = new RegExp(/^[\w\-\.]+[\w]+@([\w-]+\.)+[a-zA-Z]*$/);
const phoneRegex = new RegExp(/^\+[\d]{1,1}\([\d]{4,4}\) [\d]{3}-[\d]{2}-[\d]{2}$/);
const nameRegex = new RegExp(/^[a-zA-Zа-яА-ЯіїІЇєЄ]*$/);
const passportRegex = new RegExp(/^([A-Z]{2}[\d]{6})|([\d]{9})$/);
const birthdayRegex = new RegExp(/^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-((19[0-9]{2})|(20([0-1][0-9]|2[0-2])))$/);
let userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            match: nameRegex
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: emailRegex
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            match: phoneRegex
        },
        passport: {
            type: String,
            required: true,
            match: passportRegex
        },
        birthday: {
            required: true,
            type: String,
            match: birthdayRegex
        },
        token: {
            type: String,
        }
    }
);

interface ErrorStatus extends Error {
    status?: number
    code: number
}

let handleErrors = (error: ErrorStatus, next: (error?: ErrorStatus) => void): void => {
    if (error && error instanceof Error) {
        error.status = 400;
        let {name, code} = error;
        if (code === 11000 || name === 'MongoServerError') {
            error.status = 409;
        }
        return next(error);
    }
    next();
};
userSchema.post("findOneAndUpdate", handleErrors);
userSchema.post("updateOne", handleErrors);
userSchema.post("save", handleErrors);
const User = model('user', userSchema);

export const registerUser = Joi.object({
    email: Joi.string().pattern(emailRegex).required(),
    name: Joi.string().pattern(nameRegex).required(),
    phone: Joi.string().pattern(phoneRegex).required(),
    passport: Joi.string().pattern(passportRegex).required(),
    birthday: Joi.string().pattern(birthdayRegex).required(),
    password: Joi.string().min(3).required(),
    repeatPassword: Joi.string().min(3).required(),
});
export const loginUser = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
});
export default User;