import express from "express";
import {ctrlWrapper} from '../../helpers/index'
import controllerContacts from "../../controllers/contacts";
import {validateId, validateBody, authenticateUser} from './../../middlewares/index';
import {addContact, updateFavorite} from "../../models/contact";

const router = express.Router();
router.get('/', authenticateUser, ctrlWrapper(controllerContacts.getAll));
router.get('/:id', authenticateUser, validateId, ctrlWrapper(controllerContacts.getById));
router.post('/', authenticateUser, validateBody(addContact), ctrlWrapper(controllerContacts.addContact));
router.put('/:id', authenticateUser, validateId, validateBody(addContact), ctrlWrapper(controllerContacts.updateById));
router.delete('/:id', authenticateUser, validateId, ctrlWrapper(controllerContacts.deleteById));
router.patch('/:id/favorite', authenticateUser, validateId, validateBody(updateFavorite), ctrlWrapper(controllerContacts.updateFavoriteById));
export default router; 