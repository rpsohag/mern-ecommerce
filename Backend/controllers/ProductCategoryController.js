import ProductCategory from "../models/ProductCategory.js";
import AsyncHandler from "express-async-handler";

export const createCategory = AsyncHandler( async (req, res) => {
    try {
        const category = await ProductCategory.create(req.body);
        res.json(category)
    } catch (error) {
        throw new Error(error)
    }
})

export const updateCategory = AsyncHandler( async (req, res) => {
    const {id} = req.params;
    try {
        const cateogry = await ProductCategory.findByIdAndUpdate(id, req.body, { new: true})
        res.json(cateogry)
    } catch (error) {
        throw new Error(error)
    }
})

export const getAllCategory = AsyncHandler ( async (req, res) => {
    try {
        const categories = await ProductCategory.find();
        res.json(categories)
    } catch (error) {
        throw new Error(error)
    }
})
export const getSingleCategory = AsyncHandler ( async (req, res) => {
    const {id} = req.params;
    try {
        const category = await ProductCategory.findById(id);
        res.json(category)
    } catch (error) {
        throw new Error(error)
    }
})

export const deleteCategory = AsyncHandler( async (req, res) => {
    const {id} = req.params;
    try {
        const category = await ProductCategory.findByIdAndDelete(id);
        res.json(category)
    } catch (error) {
        throw new Error(error)
    }
})