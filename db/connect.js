const mongoose=require('mongoose')


const connectWithDB = (url) => {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Connected to DB");
        }).catch((error) => {
            console.log(error);
        })

}


module.exports = connectWithDB;