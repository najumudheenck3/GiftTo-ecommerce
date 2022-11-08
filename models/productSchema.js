const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    }


})


const productSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Category: {
        type: String,
        required: true
    },
    Cost: {
        type: String,
        required: true
    },
    Price: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Quantity: {
        type: Number,
        required: true
    },
    productActive: {
        type: Boolean,
        required: true,
        default: true
    },
    Images: {
        type: Array,
        required: true
    },
    reviews: {
        type: [reviewSchema]
    }
})

module.exports = mongoose.model('product', productSchema);