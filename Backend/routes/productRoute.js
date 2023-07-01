import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from '../controllers/ProductController.js';
import { authMiddleware, checkIsAdmin } from '../middlewares/authMiddleware.js';
import { addToWishList } from '../controllers/WishListController.js';
const router = express.Router();

router.post('/create', authMiddleware, checkIsAdmin, createProduct)
router.get('/:id', authMiddleware, checkIsAdmin, getSingleProduct)
router.get('/', authMiddleware, checkIsAdmin, getAllProducts)
router.put('/update/:id', authMiddleware, checkIsAdmin, updateProduct)
router.put('/wishlist', authMiddleware, addToWishList)
router.delete('/delete/:id', authMiddleware, checkIsAdmin, deleteProduct)


export default router;