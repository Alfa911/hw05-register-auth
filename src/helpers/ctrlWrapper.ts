import {NextFunction, Request, Response} from "express";
import IRequest from "../types/request";

const ctrlWrapper = (ctrl: (req: IRequest | any, res: Response) => Promise<void>) => {
    return async (req: IRequest | any, res: Response, next: NextFunction) => {
        try {
            await ctrl(req, res);
        } catch (e) {
            next(e);
        }
    };
};
export default ctrlWrapper;