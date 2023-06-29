import bcrypt from 'bcrypt'
import User from './../models/User.js';


export const createUser = async (req, res) => {
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
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({firstname, lastname, email, mobile, password : hash});
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
}