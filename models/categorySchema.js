const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const categorySchema = new Schema({
    CategoryName: {
        type: String,
        required: true
    },
    categoryActive: {
        type: Boolean,
        required: true,
        default:true
    }
})

module.exports = mongoose.model( 'category',categorySchema );