import express from 'express';
import { blockUser, deleteSingleUser, forgotPasswordToken, getAllUser, getSingleUser, handleRefreshToken, resetPassword, unblockUser, updatePassword, updateSingleUser, useRegister, userLogin, userLogout } from '../controllers/UserController.js';
import { authMiddleware, checkIsAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router();


router.post('/register', useRegister);
router.post('/login', userLogin)
router.get('/users', getAllUser)
router.get('/user/:id', authMiddleware, checkIsAdmin, getSingleUser)
router.delete('/user/:id', deleteSingleUser)
router.put('/update/:id', authMiddleware, updateSingleUser)
router.put('/block-user/:id', authMiddleware, checkIsAdmin, blockUser)
router.put('/unblock-user/:id', authMiddleware, checkIsAdmin, unblockUser)
router.post('/refresh-token', handleRefreshToken)
router.put('/update-password', authMiddleware, updatePassword)
router.post('/forgot-password-token', forgotPasswordToken)
router.put('/reset-password/:token', resetPassword)
router.get('/logout', userLogout)

export default router;