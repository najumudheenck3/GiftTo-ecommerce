require('dotenv').config()
const express=require('express')
port = process.env.PORT || 4000;
const path = require('path')
const ejs=require('ejs')
var logger = require('morgan');
const connectDb=require('./db/connect')
const session=require('express-session')
const flush=require('connect-flash')
// const fileUpload=require('express-fileupload')
const nocache = require('nocache');
const Swal = require('sweetalert2')


const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:"key",cookie:{maxAge:60*60*1000}}));
app.use(flush());
// app.use(fileUpload())
app.use(nocache());






app.use('/', userRouter);
app.use('/admin',adminRouter)
// app.listen(4000)



const strat = async ()=>{
    try{
        await connectDb(process.env.MONGO_URI)
        app.listen(port,()=>{console.log(`Listening to port ${port}  http://localhost:${port}/`)})

    }catch(err){
        console.log(err);
    }
}

strat()

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
  });
// error handler
app.use(function (err, req, res, next) {
      // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
 });

module.exports = app;
