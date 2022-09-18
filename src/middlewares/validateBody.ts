import {createError} from '../helpers/index'
import {Request, Response, NextFunction} from "express";
const validateBody = (schema: any) => {
    const func = (req: Request, res: Response, next: NextFunction): void => {
        const {error} = schema.validate(req.body);

        if (error) {
            const reqErrors = createError(400, error.message);
            return next(reqErrors);
        }
        next();
    };
    return func;

}
export default validateBody;