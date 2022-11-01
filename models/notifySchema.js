const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notifySchema = new Schema({
    email: {
        type: String,
        required: true
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product',
       
    }
})


module.exports = mongoose.model('notifyProducts',notifySchema)