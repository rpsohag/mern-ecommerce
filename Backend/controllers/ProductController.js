import AsyncHandler from 'express-async-handler';
import Product from './../models/Product.js';
import slugify from 'slugify';

export const createProduct = AsyncHandler(async (req, res) => {
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body);
        res.status(201).json({
            message: "product created successfully!",
            data: newProduct
        })
    } catch (error) {
        throw new Error(error)
    }
})

export const getSingleProduct = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id)
        res.status(200).json({
            data: product
        })
    } catch (error) {
        throw new Error(error)
    }
})

export const getAllProducts = AsyncHandler (async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            data: products
        })
    } catch (error) {
        throw new Error(error)
    }
})

export const updateProduct = AsyncHandler( async (req, res) => {
    const {id} = req.params;

    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const product = await Product.findOneAndUpdate({_id : id}, req.body, {new : true});
        res.status(200).json({
            message: "product Updated successfully!",
            data: product
        })
    } catch (error) {
        throw new Error(error)
    }
})

export const deleteProduct = AsyncHandler( async (req, res) => {
    const {id} = req.params;

    try {
        const product = await Product.findByIdAndDelete({_id : id});
        res.status(200).json({
            message: "product Deleted successfully!",
            data: product
        })
    } catch (error) {
        throw new Error(error)
    }
})