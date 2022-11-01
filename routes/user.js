var express = require('express');
var router = express.Router();
var userFun=require('../controllers/userRouter')
const userRouter=require('../controllers/userRouter')
const user = require('../models/userSchema')

const verifyUser = (async (req, res, next) => {
    if (req.session.loggedIn) {
        let userId=req.session.user._id
      let userd =await user.findById(userId)
      if (userd.giftUser ) {
        next()
      } else {
        req.session.loggedIn = false
        req.session.user = null
        res.redirect('/login')
      }
    } else {
      res.redirect('/login')
    }
  })
  


router.route('/').get(userRouter.userHome)

router.route('/shop-products').get(userRouter.shopProducts)

router.route('/login').get(userRouter.userLogin).post(userRouter.userpostLogin)

router.route('/signup').get(userRouter.userSignup).post(userRouter.userpostSignup)

router.route('/logout').get(userRouter.userLogout)

router.route('/otp').get(userRouter.otpget).post(userRouter.postget)

router.route('/my-profile').get(verifyUser,userRouter.getMyProfile)

router.route('/view-one-product/:id').get(userRouter.viewOneProduct)

router.route('/cart').get(verifyUser,userRouter.viewCart)

router.route('/add-to-cart/:proId/:qty').get(verifyUser,userRouter.addToCart)

router.route('/change-quantity/:proId/:changeStatus').post(userRouter.changeQuantity)

router.route('/delete-from-cart/:proId').delete(userRouter.deleteCartItem)

router.route('/categoy-products').get(userRouter.categoryWiseProducts)

router.route('/add-to-wishlist/:proId').post(userRouter.addToWishlist)

router.route('/wishlist').get(verifyUser,userRouter.viewWishlist)

router.route('/delete-from-wishlist/:proId').delete(userRouter.deleteWishlistItem)

router.route('/checkout').get(verifyUser,userRouter.checkOut)

router.route('/redeem/:coupCode/:total').post(userRouter.redeemCoupnAmount)

router.route('/placeOrder').post(userRouter.placeOrder)

router.route('/payment/orderId').post(userRouter.generateOrder)

router.route('/payment/verify/:orderId').post(userRouter.verifyPayment)

router.route('/order-success').get(userRouter.orderSuccessPage)

router.route('/getorder').get(userRouter.getOrder)

router.route('/addAddress').post(userRouter.addAndEditAddress)

router.route('/delete-address/:addresIndex').delete(userRouter.deleteAddress)

router.route('/cancel-order/:orderId').post(userRouter.cancelOrder)

router.route('/notify-product').post(userRouter.addNotifyProduct)



// router.get('/about',(req,res)=>{
//     res.render('users/about')
// })

// router.get('/product',(req,res)=>{
//     res.render('users/product')
// })

// router.get('/login',(req,res)=>{
//     res.render('users/login')
// })

// router.get('/signup',(req,res)=>{
//     res.render('users/signup')
// })



module.exports=router