import BlogCategory from "../models/BlogCategory.js";
import AsyncHandler from "express-async-handler";

export const createCategory = AsyncHandler(async (req, res) => {
  try {
    const category = await BlogCategory.create(req.body);
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

export const updateCategory = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const cateogry = await BlogCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(cateogry);
  } catch (error) {
    throw new Error(error);
  }
});

export const getAllCategory = AsyncHandler(async (req, res) => {
  try {
    const categories = await BlogCategory.find();
    res.json(categories);
  } catch (error) {
    throw new Error(error);
  }
});
export const getSingleCategory = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const category = await BlogCategory.findById(id);
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteCategory = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const category = await BlogCategory.findByIdAndDelete(id);
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});
