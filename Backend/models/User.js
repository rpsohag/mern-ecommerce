import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import crypto from "crypto"


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
    address: {
        type: String
    },
    wishlist: [{type: mongoose.Schema.Types.ObjectId, ref: "Product"}],
    refreshToken: {
        type: String
    },
    passwordChangeAt : {
        type: Date
    },
    passwordResetToken : {
        type: String
    },
    passwordResetExpires: {
        type: Date
    }
},{
    timestamps: true,
    versionKey: false
});


userSchema.pre("save", async function (next) {
    try {
        if(!this.isModified("password")){
            next()
        }
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

userSchema.methods.createPasswordResetToken = async function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000 // 30 minutes
    return resetToken;

}

userSchema.methods.isValidPassword = async  function(password){
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error;
    }
}




//Export the model
export default mongoose.model('User', userSchema);