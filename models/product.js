const mongoose = require('mongoose')

const productSchema =new mongoose.Schema({
   name:{
    type:String,
    required:[true,'product name must be provided']
   }, 
   price:{
    type:Number,
    required:[true,'product price must be provided']
   },

   featured:{
    type:Boolean,
    default:false,
   },

   rating:{
    type: Number,
    default:4.5
   },
   createdAt:{
    type: Date,
    defaut:Date.now,
   },
   campany:{
      type:String,
      enum:{
         values:['ikea','liddy','caressa','marcas'],
         message:'{VALUE} is not supported',
      },
      //enum:['ikea','liddy','caressa','marcas']
   },
})
 module.exports = mongoose.model('products', productSchema)
