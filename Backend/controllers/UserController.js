import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler'
import User from './../models/User.js';
import { generateToken } from '../config/jwtToken.js';
import { validateMongoDBId } from '../utils/validateMongodDBId.js';
import { generateRefreshToken } from '../config/refreshToken.js';
import jwt from 'jsonwebtoken'


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
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(findUser.id, {refreshToken : refreshToken},{new : true})
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 23 * 60 * 60* 1000
        })

        
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


export const handleRefreshToken =  asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error('No refresh token in cookies');
    const rToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken:  rToken });
    if(!user){
        throw new Error('No refreshToken in db')
    }
    jwt.verify(rToken, process.env.JWT_SECRET, (err, decoded) => {
       if(err || user.id !== decoded.id){
        throw new Error('something wrong with refresh token')
       }
       const accessToken = generateToken(user?.id)
       res.json({ accessToken})
    })
})


export const userLogout = asyncHandler( async (req, res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error('No refresh token in cookies');
    const rToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken:  rToken });
    if(!user){
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        })
        return res.sendStatus(204)
    }
    await User.findOneAndUpdate({ refreshToken: rToken}, {
        refreshToken: ""
    })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.sendStatus(204)

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
    validateMongoDBId(id)
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
    validateMongoDBId(id)
    try {
        const user = await User.findByIdAndDelete(id);
        res.status(200).json({
            data: user
        })
    } catch (error) {
        throw new Error(error)
    }
})

export const blockUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDBId(id)
    try {
        const block = await User.findByIdAndUpdate(id, {
            isBlocked: true
        },{
            new : true
        })
        res.json({
            message: "User Blocked Successfully",
            data: block
        })
    } catch (error) {
        throw new Error(error)
    }
})
export const unblockUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDBId(id)
    try {
        const block = await User.findByIdAndUpdate(id, {
            isBlocked: false
        },{
            new : true
        })
        res.json({
            message: "User unBlocked Successfully",
            data: block
        })
    } catch (error) {
        throw new Error(error)
    }
})

export const updateSingleUser = asyncHandler(async(req, res) => {
    const {_id} = req.user;
    validateMongoDBId(_id)
    try {
        const user = await User.findByIdAndUpdate(_id, {
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