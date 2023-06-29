import express from 'express';
import { deleteSingleUser, getAllUser, getSingleUser, updateSingleUser, useRegister, userLogin } from '../controllers/UserController.js';
const router = express.Router();


router.post('/register', useRegister);
router.post('/login', userLogin)
router.get('/users', getAllUser)
router.get('/user/:id', getSingleUser)
router.delete('/user/:id', deleteSingleUser)
router.put('/update/:id', updateSingleUser)

export default router;