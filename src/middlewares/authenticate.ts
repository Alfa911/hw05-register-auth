import Passport from "passport";
import User from "../models/user";
import {NextFunction, Request, Response} from "express";
import passportJWT from 'passport-jwt';
import 'dotenv/config';

const {SECRET_JWT = ''} = process.env;

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
let params = {
    secretOrKey: SECRET_JWT,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
};
Passport.use('jwt',
    new Strategy(params, async function (payload, done) {
        let user = await User.findOne({_id: payload.id});

        if (!user) {
            return done(new Error('User not found'));
        }
        return done(null, user);
    }),
);
const authenticateUser = (req: any, res: Response, next: NextFunction) => {
    Passport.authenticate('jwt', {session: false}, (err, user) => {
        const token = params.jwtFromRequest(req);

        if (!user || err || user.token !== token) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }
        req.user = user;
        next();
    })(req, res, next);

};
export default authenticateUser;
