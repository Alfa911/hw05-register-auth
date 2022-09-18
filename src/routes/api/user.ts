import express from "express";
import {ctrlWrapper} from '../../helpers/index'
import controllerUser from "../../controllers/user";
import {validateBody, authenticateUser} from './../../middlewares/index';
import {registerUser, loginUser} from "../../models/user";

const router = express.Router();
router.post('/register', validateBody(registerUser), ctrlWrapper(controllerUser.register));
router.post('/login', validateBody(loginUser), ctrlWrapper(controllerUser.login));
router.get('/current', authenticateUser, ctrlWrapper(controllerUser.current));
router.get('/logout',authenticateUser, ctrlWrapper(controllerUser.logout));
export default router;