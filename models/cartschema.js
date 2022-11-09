

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