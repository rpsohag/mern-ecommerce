import AsyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken'
import User from "../models/User.js";


export const authMiddleware = AsyncHandler(async (req, res, next) => {
    let token;
    if(req?.headers?.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
        try {
            if(token){
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded?.id)
                req.user = user;
                next()
            }
        } catch (error) {
            throw new Error(error)
        }
    }else{
        throw new Error('There is no token attached to the header')
    }
})

export const checkIsAdmin = AsyncHandler(async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({email});
    if(adminUser.role !== "admin"){
        throw new Error('You are not an admin')
    }else{
        next()
    }
})