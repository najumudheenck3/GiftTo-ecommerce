const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  
  
  })

const adminSchema = new Schema({
    Email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    ctMessages:{
        type : [messageSchema]
    }
})

module.exports = mongoose.model( 'admin',adminSchema );