import express from 'express';
import { createBlog, deleteBlog, dislikeBlog, getAllBlogs, likeBlog, singleBlog, updateBlog } from '../controllers/BlogController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/create', createBlog)
router.get('/:id', singleBlog)
router.put('/update/:id', updateBlog)
router.get('/', getAllBlogs)
router.delete('/delete/:id', deleteBlog)
router.put('/likes', authMiddleware, likeBlog)
router.put('/dislikes', authMiddleware, dislikeBlog)

export default router;