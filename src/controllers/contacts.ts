import createError from '../helpers/createError';
import Contact from '../models/contact';
import {Response} from "express";
import IRequest from '../types/request';

type controllerCt = {
    getAll: (req: IRequest, res: Response) => Promise<void | never>
    getById: (req: IRequest, res: Response) => Promise<void | never>
    addContact: (req: IRequest, res: Response) => Promise<void | never>
    updateById: (req: IRequest, res: Response) => Promise<void | never>
    updateFavoriteById: (req: IRequest, res: Response) => Promise<void | never>
    deleteById: (req: IRequest, res: Response) => Promise<void | never>
}
let controllerContacts: controllerCt = {
    getAll: async (req: IRequest, res: Response): Promise<void | never> => {
        let list = await Contact.find({owner: req.user.id}).select("-owner");
        res.json(list)
    },
    getById: async (req: IRequest, res: Response): Promise<void | never> => {
        const {id} = req.params;
        let result = await Contact.findOne({'_id': id, owner: req.user.id});
        if (!result) {
            throw createError(404);
        }
        res.json(result)
    },
    addContact: async (req: IRequest, res: Response): Promise<void | never> => {
        const {user} = req;
        req.body.owner = user.id;
        let newModel = new Contact(req.body);
        let result = await newModel.save();
        res.status(201).json(result)
    },
    updateById: async (req: any | IRequest, res: Response): Promise<void | never> => {
        const {id} = req.params;
        let result = await Contact.findOneAndUpdate({"_id": id, 'owner': req.user.id}, req.body, {new: true});
        if (!result) {
            throw createError(404);
        }
        res.json(result)
    },
    deleteById: async (req: IRequest, res: Response): Promise<void | never> => {
        const {id} = req.params;
        let result = await Contact.findByIdAndRemove({"_id": id, 'owner': req.user.id});
        if (!result) {
            throw createError(404);
        }

        res.json(result)

    },
    updateFavoriteById: async (req: IRequest, res: Response): Promise<void | never> => {
        const {id} = req.params;
        let {favorite} = req.body;
        let result = await Contact.findOneAndUpdate({
            "_id": id,
            'owner': req.user.id
        }, {favorite: favorite}, {new: true});

        if (!result) {
            throw createError(404);
        }
        res.json(result)

    },
};


export default controllerContacts;