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

        // filtering
        const queryObj = {...req.query};
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach(el => {
            delete queryObj[el]
        })

        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        let query = Product.find(JSON.parse(queryString));

        // sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(" ")
            query = query.sort(sortBy)
        }else{
            query = query.sort('-createdAt')
        }

        // limiting
        if(req.query.fields){
            const fields = req.query.fields.split(",").join(" ")
            query = query.select(fields)
        }else{
            query = query.select("-__v")
        }

        // pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit)

        if(req.query.page){
            const productCount = await Product.countDocuments();
            if(skip >= productCount) throw new Error("This is does not exits")
        }

        const products = await query;
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