import AsyncHandler from "express-async-handler";
import User from "../models/User.js";



export const addToWishList = AsyncHandler ( async (req, res) => {
    const {_id} = req.user;
    const {prodId} = req.body;
    try {
        const user = await User.findById(_id);
        console.log(user)
        const alreadyAddd = user.wishlist.find((id) => id.toString() === prodId.toString());
        if(alreadyAddd){
            let user = await User.findByIdAndUpdate(_id, {
                $pull : { wishlist : prodId}
            },{ new : true})
            res.json(user)
        }else{
            let user = await User.findByIdAndUpdate(_id, {
                $push : { wishlist: prodId}
            },{ new : true})
            res.json(user)
        }

    } catch (error) {
        throw new Error(error)
    }
})

export const getWishList = AsyncHandler( async (req, res) => {
    const { _id} = req.user;

    try {
    const user = await User.findById(_id).populate('wishlist');
    res.json(user)

    } catch (error) {
        throw new Error(error)
    }
})