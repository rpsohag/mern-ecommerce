import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler'
import User from './../models/User.js';
import { generateToken } from '../config/jwtToken.js';


export const useRegister = asyncHandler(async (req, res) => {
    const {firstname, lastname, email, mobile, password} = req.body;
    if(!firstname, !lastname, !email, !mobile, !password){
        return res.status(400).json({
            message: "All fields are required!"
        })
    }
    const emailCheck = await User.findOne({email});
    if(emailCheck){
        return res.status(400).json({
            message: "Email Already Registered!"
        })
    }
    const user = await User.create({firstname, lastname, email, mobile, password});
     if(user){
        return res.status(200).json({
            message: "User Created Successfully!",
            data: user
        })
     }else{
        return res.status(400).json({
            message: "Something went wrong!"
        })
     }
})

export const userLogin = asyncHandler( async (req, res) => {
    const {email, password } = req.body;
    // check if user exists or not
    const findUser = await User.findOne({email});
    if(findUser && (await findUser.isValidPassword(password))){
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        })
    }else{
         throw new Error("Invalid Credentials")
    }
})

export const getAllUser = asyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users)
    } catch (error) {
        throw new Error(error)
    }
})

export const getSingleUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
        const user = await User.findById(id);
        res.status(200).json({
            data: user
        })
    } catch (error) {
        throw new Error(error)        
    }
})

export const deleteSingleUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        res.status(200).json({
            data: user
        })
    } catch (error) {
        throw new Error(error)
    }
})

export const updateSingleUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
    try {
        const user = await User.findByIdAndUpdate(id, {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            mobile: req.body.mobile,
        },{ new : true})
        res.status(200).json({
            data: user
        })
    } catch (error) {
        throw new Error(error)
    }
})