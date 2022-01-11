import mongoose from 'mongoose';
const {ObjectId} = mongoose.Schema.Types

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/instagramc/image/upload/v1619330222/download_2_t3c4n0.png"
       },
       followers:[{type:ObjectId,ref:"User"}],
       following:[{type:ObjectId,ref:"User"}]

});
var User=mongoose.model("User",userSchema);

export default User;