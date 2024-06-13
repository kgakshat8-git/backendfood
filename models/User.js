const mongoose=require('mongoose');
const Schema1=mongoose.Schema;  //const{Schema}=mongoose

const UserSchema=new Schema1({
    name:{
        type: String,
        required: true
    },
    location:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('user',UserSchema); //creates a user(s) collection with schema=userSchema

