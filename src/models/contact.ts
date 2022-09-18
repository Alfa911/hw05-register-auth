import mongoose, {Document} from "mongoose";
import Joi from "joi";

interface IContact extends Document {
    name: string;
    email: string;
    phone: string;
    owner: any;
    favorite?: boolean;
}

const {Schema, model} = mongoose;
const emailRegex = new RegExp(/^[\w\-\.]+[\w]+@([\w-]+\.)+[a-zA-Z]*$/);
const phoneRegex = new RegExp(/^\+[\d]{1,1}\([\d]{4,4}\) [\d]{3}-[\d]{2}-[\d]{2}$/);

let contactSchema = new Schema<IContact>(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: emailRegex

        },
        phone: {
            type: String,
            required: true,
            unique: true,
            match: phoneRegex

        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        favorite: {
            type: Boolean,
            default: false
        }
    }
);

interface ErrorStatus extends Error {
    status?: number
    code: number
}

let handleErrors = (error: ErrorStatus, next: (error?: ErrorStatus) => void): void => {
    if (error instanceof Error) {
        error.status = 400;
        let {name, code} = error;
        if (code === 11000 || name === 'MongoServerError') {
            error.status = 409;
        }
        return next(error);
    }
    next();
};
contactSchema.post("findOneAndUpdate", handleErrors);
contactSchema.post("updateOne", handleErrors);
contactSchema.post("save", handleErrors);
const Contact = model('contact', contactSchema);

export const addContact = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(emailRegex).required(),
    phone: Joi.string().pattern(phoneRegex).required(),
    favorite: Joi.boolean(),
});
export const updateFavorite = Joi.object({
    favorite: Joi.boolean().required(),

});
export default Contact;