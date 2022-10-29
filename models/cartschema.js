// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

// const ItemSchema = new Schema({
//     ProductId: {
//         type: String,
//         required: true
//     },
//     Quantity:{
//         type:String,
//         required: true
//     },
//     Price:{
//         type:String,
//         required: true
//     },
//     Total:{
//         type:String,
//         required:true
//     }

// })

// const cartSchema = new Schema({
//     UserId: {
//         type: String,
//         required: true
//     },
//     SubTotal:{
//         type:String,
//         required:true
//     },
//     Items:[ItemSchema]
// })

// module.exports = mongoose.model('cart', cartSchema);

const mongoose = require("mongoose");


const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    products: [
        {
            productId:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product"
            },
            quantity: Number,
            name: String,
            price: Number,
        }
    ],
    total:{
        type:Number,
        defult:0,
      
    }
   
},{timestamps: true});
module.exports = mongoose.model("Cart", CartSchema);