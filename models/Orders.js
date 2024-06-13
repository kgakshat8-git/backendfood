const mongoose=require('mongoose');
const Schema2=mongoose.Schema
const orderSchema=new Schema2({
    email:{
        type:String,
        required:true,
        unique:true
    },
    order_data:{
        type:Array,
        required:true
    }
})

module.exports=mongoose.model('order',orderSchema)