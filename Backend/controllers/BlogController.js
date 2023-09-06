import AsyncHandler from "express-async-handler";
import fs from "fs";
import Blog from "../models/Blog.js";
import { cloudinaryUploadImg } from "../utils/cloudinary.js";

export const createBlog = AsyncHandler(async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json({
      message: "Blog created Successfully!",
      data: blog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const updateBlog = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: "blog updated successfully!",
      data: updateBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const singleBlog = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    await Blog.findByIdAndUpdate(id, { $inc: { numViews: 1 } }, { new: true });
    res.json({
      data: blog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const getAllBlogs = AsyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find().populate("likes").populate("dislikes");
    res.json({
      data: blogs,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteBlog = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findByIdAndDelete(id);
    res.json({
      message: "Blog deleted Successfully",
      data: blog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const likeBlog = AsyncHandler(async (req, res) => {
  const { blogId } = req.body;
  const blog = await Blog.findById(blogId);
  const loginUserId = req?.user?._id;
  const isLiked = blog?.isLiked;
  const isDisliked = blog?.dislikes?.find(
    (userId) => userId.toString() === loginUserId.toString()
  );
  if (isDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});

export const dislikeBlog = AsyncHandler(async (req, res) => {
  const { blogId } = req.body;
  const blog = await Blog.findById(blogId);
  const loginUserId = req?.user?._id;
  const isDisliked = blog?.isDisliked;
  const isLiked = blog?.likes?.find(
    (userId) => userId.toString() === loginUserId.toString()
  );
  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});

export const uploadImages = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    const findBlog = await Blog.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      {
        new: true,
      }
    );
    res.json(findBlog);
  } catch (error) {
    throw new Error(error);
  }
});
