import mongoose from "mongoose";
import bcrypt from 'bcrypt'


// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role: {
        type : String,
        default : "user"
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    cart: {
        type : Array,
        default : []
    },
    address: [{type: mongoose.Schema.Types.ObjectId, ref: "Address"}],
    wishlist: [{type: mongoose.Schema.Types.ObjectId, ref: "Product"}],
    refreshToken: {
        type: String
    }
},{
    timestamps: true,
    versionKey: false
});


userSchema.pre("save", async function(next) {
    try {
        if(this.isNew){
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(this.password, salt);
            this.password = hashPassword;
        }
        next()
    } catch (error) {
        next(error)
    }
})

userSchema.methods.isValidPassword = async  function(password){
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error;
    }
}




//Export the model
export default mongoose.model('User', userSchema);