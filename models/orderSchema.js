const mongoose =require('mongoose')

const orderSchema = new mongoose.Schema({
    userId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required : true
    },
    deliveryAddress: {
        type:Object
    },
    products:[
        {
            productId : {
                type:mongoose.Schema.Types.ObjectId,
                ref:"product"
            },
            quantity :Number,
            name : String,
            price: Number
        }
    ],
    quantity : {
        type :Number
    },
    total : {
        type:Number
    },
    discount : {
        type:Number
    },
    paymentType : {
        type : String,
        required:true
    },
    razorpayOrderId : {
        type:String,

    },
    razorpayPaymentId: {
        type :String
    },
    orderActive: {
        type: Boolean,
        default: true
    },
    status : {
        type:String,
        default:"placed"
    }
},{timestamps:true})
module.exports = mongoose.model("Order",orderSchema)