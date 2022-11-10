const mongoose = require('mongoose');
const userModel = require('../models/userSchema')
const bcrypt = require('bcrypt');
const twil = require('../config/twilio')
const otpGenerator = require('otp-generator')
const Product = require('../models/productSchema')
const cartModel = require('../models/cartschema')
const wishlistModel = require('../models/wishlistSchema')
const couponModel = require('../models/coupenSchema')
const orderModel = require('../models/orderSchema');
const Razorpay = require('razorpay');
const twilioHelpers = require('../utils/otpverify');
const category = require('../models/categorySchema')
const notifyModel = require('../models/notifySchema');
const bannerModel =require('../models/bannerShcema')
const adminModel=require('../models/adminSchmea')



const instance = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret,
});




exports.userHome = async (req, res,next) => {
  try{
    let user = req.session.user
    let cartNumber = req.session.cartNumber
    let wishlistNumber = req.session.wishlistNumber
    if (req.session.loggedIn) {
        const userId = req.session.user._id
        const wishlist = await wishlistModel.findOne({ userId: userId }).populate("myWish.productId").exec()
        if (wishlist) {
            req.session.wishlistNumber = wishlist.myWish.length
        }
    }
    let Category = await category.find({})
    const banner = await bannerModel.find({ isActive: true })
    Product.find({ productActive: true }, (err, data) => {
        // console.log(data);
        res.render('users/home', { user,banner, Category, cartNumber, wishlistNumber, products: data })
    })
  }catch (err) {
    console.log(err);
    next(err)
}
}

exports.shopProducts = async (req, res,next) => {
    let user = req.session.user
    let cartNumber = req.session.cartNumber
    let wishlistNumber = req.session.wishlistNumber
    try{
        if (req.session.loggedIn) {
            const userId = req.session.user._id
            const wishlist = await wishlistModel.findOne({ userId: userId }).populate("myWish.productId").exec()
            if (wishlist) {
                req.session.wishlistNumber = wishlist.myWish.length
            }
        }
        console.log(cartNumber);
        let Category = await category.find({})
        let products = await Product.find({ productActive: true })
        console.log(products);
    
        res.render('users/shop-products', { user, Category, cartNumber, wishlistNumber, products })
    }catch (err) {
        console.log(err);
        next(err)
    }
}

exports.getMyProfile = async (req, res,next) => {
    let user = req.session.user
    // console.log(user,'ith thanda user');
    let cartNumber = req.session.cartNumber
    let wishlistNumber = req.session.wishlistNumber
    try{
        if (req.session.loggedIn) {
            const userId = req.session.user._id
            const wishlist = await wishlistModel.findOne({ userId: userId }).populate("myWish.productId").exec()
            if (wishlist) {
                req.session.wishlistNumber = wishlist.myWish.length
            }
        }
        let userAlldetails = await userModel.findOne({ _id: req.session.user._id })
        // console.log(userAlldetails);
        res.render('users/my-profile', { user: userAlldetails, cartNumber, wishlistNumber })
    }catch (err) {
        console.log(err);
        next(err)
    }
}

exports.categoryWiseProducts = async (req, res,next) => {
    let user = req.session.user
    let cartNumber = req.session.cartNumber
    let wishlistNumber = req.session.wishlistNumber
    try{
        if (req.session.loggedIn) {
            const userId = req.session.user._id
            const wishlist = await wishlistModel.findOne({ userId: userId }).populate("myWish.productId").exec()
            if (wishlist) {
                req.session.wishlistNumber = wishlist.myWish.length
            }
        }
        let categoryName = req.query.category
        let categoyProducts = await Product.find({ Category: categoryName })
        let Category = await category.find({})
        res.render('users/category-products', { user, Category, cartNumber, wishlistNumber, products: categoyProducts })
        console.log(categoyProducts);
    
    }catch (err) {
        console.log(err);
        next(err)
    }
}

exports.userLogin = (req, res,next) => {
    if (req.session.loggedIn) {
        res.redirect('/')
    } else {
        res.render('users/login', { message: req.flash('message') })
    }
}

exports.userpostLogin = (req, res,next) => {
    // console.log(req.body);
  try{
    const loginData = {
        Email: req.body.Email,
        Password: req.body.Password
    }
    
    userModel.find({ Email: loginData.Email }, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data) {
            if (data.length > 0) {

                if (data[0].giftUser === true) {
                    bcrypt.compare(loginData.Password, data[0].Password, async (err, match) => {
                        if (err) {
                            console.log(err);
                        } else if (!match) {
                            req.flash('message', 'Invalid Usernameannoo or Password')
                            res.redirect('/login')
                        } else {
                            req.session.loggedIn = true
                            req.session.user = data[0]
                            const userId = req.session.user._id
                            const viewcart = await cartModel.findOne({ userId: userId }).populate("products.productId").exec()
                            if (viewcart) {
                                req.session.cartNumber = viewcart.products.length
                            }
                            const wishlist = await wishlistModel.findOne({ userId: userId }).populate("myWish.productId").exec()
                            if (wishlist) {
                                req.session.wishlistNumber = wishlist.myWish.length
                            }
                            
                            // console.log(req.session.user);
                            res.redirect('/')
                        }
                    })
                    // console.log(data[0].Password);
                } else {
                    req.flash('message', 'blocked you')
                    res.redirect('/login')
                }
                // res.redirect('/')
            } else {
                req.flash('message', 'Ivalide Username or Password')
                res.redirect('/login')
            }
        }
    })

  }catch(err){
    next(err)

}

}

exports.userSignup = (req, res,next) => {
    if (req.session.loggedIn) {
        res.redirect('/')
    } else {
        res.render('users/signup', { message: req.flash('message') })

    }
}

exports.userpostSignup = (req, res,next) => {

    try{
        const userData = {
            Name: req.body.Name,
            Email: req.body.Email,
            Password: req.body.Password,
            Number: req.body.Number,
            giftUser: true
        }
        console.log(userData.Number);
    
        userModel.find({ $or: [{ Email: userData.Email }, { Number: userData.Number }] }, async (err, data) => {
            if (err) {
                console.log(err);
            } else {
                if (data.length === 0) {
                    console.log(userData, 'haiii');
                    console.log(("aaa"));
                    userData.Password = await bcrypt.hash(userData.Password, 10)
                    console.log(userData.Password,'klmnop');
                    req.session.userData = userData
                    console.log('hellooo');
                    let data = await twilioHelpers.doSms(userData)
                    if (data) {
                        console.log(("bbb"));
    
                        res.redirect('/otp')
                    } else {
                        res.redirect('/signup')
                    }
                    // console.log(userData.Password);
                } else {
                    req.flash('message', 'UserExist')
                    res.redirect('/signup')
                }
    
            }
        })
    }catch(err){
        next(err)

    }
}

exports.otpget = (req, res, next) => {
    if (req.session.loggedIn) {
        res.redirect('/')
    } else {
        res.render('users/otp', { errOtp: req.flash('errOtp') })

    }
}

exports.postget = async (req, res, next) => {
    try{
        let userData = req.session.userData
    let result = await twilioHelpers.otpVerify(req.body, userData)
    // const latOtp = req.body.otp;
    // console.log(req.session.otpgen);
    // let otpgen = req.session.otpgen;
    if (result) {

        const userSignData = new userModel({
            Name: userData.Name,
            Email: userData.Email,
            Password: userData.Password,
            Number: userData.Number,
            giftUser: userData.giftUser
        })
        userSignData.save().then((data) => {
            console.log(data);
            req.session.loggedIn = true
            req.session.user = data
            res.redirect('/')
        })
    } else {
        req.flash('errOtp', 'Errot Otp')
        res.redirect('/otp')
    }
    }catch(err){
        next(err)

    }
}


exports.viewOneProduct = async (req, res,next) => {
    // console.log(req.params.id);
    let proId = req.params.id
    try{
        let data= await Product.findById(proId)
        // Product.findOne({ _id: proId }, async (err, data) => {
        //     console.log(data,'111');
            if (req.session.loggedIn) {
                const userId = req.session.user._id
                const viewcart = await cartModel.findOne({ userId: userId }).populate("products.productId").exec()
                if (viewcart) {
                    req.session.cartNumber = viewcart.products.length
                }
                const wishlist = await wishlistModel.findOne({ userId: userId }).populate("myWish.productId").exec()
                if (wishlist) {
                    req.session.wishlistNumber = wishlist.myWish.length
                }
    
            }
            let relatedProducts = await Product.find({ Category: data.Category })
            // console.log(relatedProducts,'kkkkk');
            // console.log(data);
            res.render('users/oneproductdetail', { user: req.session.user, relatedProducts, wishlistNumber: req.session.wishlistNumber, cartNumber: req.session.cartNumber, product: data })
    
        // })
    }catch(err){
        next(err)

    }
}

exports.addToCart = async (req, res,next) => {
    const productId = req.params.proId
    const quantity = parseInt(req.params.qty)

    try {
       if(req.session.loggedIn){
        console.log('11');
        const findProduct = await Product.findById(productId)
        const price = findProduct.Price
        const name = findProduct.Name
        console.log(findProduct.Quantity);
        if (findProduct.Quantity >= quantity) {
            console.log('1');
            findProduct.Quantity -= quantity
            const userId = req.session.user._id
            let cart = await cartModel.findOne({ userId });
            if (cart) {
                console.log('2');

                //cart exists for user
                let itemIndex = cart.products.findIndex(p => p.productId == productId);
                console.log(itemIndex);
                if (itemIndex > -1) {
                    console.log('3');

                    //product exists in the cart, update the quantity
                    let productItem = cart.products[itemIndex];
                    productItem.quantity += quantity;
                } else {
                    //product does not exists in cart, add new item
                    cart.products.push({ productId, quantity, name, price });
                }
                cart.total = cart.products.reduce((acc, curr) => {
                    return acc + curr.quantity * curr.price;
                }, 0)

                await cart.save()
            } else {
                console.log('4');

                //no cart for user, create new cart
                const total = quantity * price

                cart = new cartModel({
                    userId: userId,
                    products: [{ productId, quantity, name, price }],
                    total: total
                });
                await cart.save()
            }
            res.json({ status: true })
        } else {
            res.json({ status: true })

        }
       }else{
        res.json({ status: false })
       }
    } catch (err) {
        console.log(err);
        next(err)

    }
}


exports.viewCart = async (req, res,next) => {
   try{
    const userId = req.session.user._id
    const viewcart = await cartModel.findOne({ userId: userId }).populate("products.productId").exec()
    if (viewcart) {
        req.session.cartNumber = viewcart.products.length
    }
    const wishlist = await wishlistModel.findOne({ userId: userId }).populate("myWish.productId").exec()
    if (wishlist) {
        req.session.wishlistNumber = wishlist.myWish.length

    }
    res.render('users/cart', { cartProducts: viewcart, wishlistNumber: req.session.wishlistNumber, cartNumber: req.session.cartNumber, user: req.session.user })

   } catch (err) {
    console.log(err);
    next(err)

}
}


exports.changeQuantity = async (req, res,next) => {
    let productId = req.params.proId.toString()
    let changeStatus = req.params.changeStatus
    let userId = req.session.user._id
    try{
        let cart = await cartModel.findOne({ userId });
    // console.log(cart);
    let itemIndex = cart.products.findIndex(p => p._id == productId);
    // console.log(itemIndex, 'mmmmmm');
    let productItem = cart.products[itemIndex];

    if (changeStatus == -1) {
        productItem.quantity -= 1;
    } else {
        productItem.quantity += 1;
    }

    cart.total = cart.products.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
    }, 0)

    await cart.save()
    res.json({ status: true })
    }catch (err) {
        console.log(err);
        next(err)
    }

}

exports.deleteCartItem = async (req, res,next) => {
    let productId = req.params.proId
    let userId = req.session.user._id
    try{
        let cart = await cartModel.findOne({ userId });
    let itemIndex = cart.products.findIndex(p => p._id == productId);
    cart.products.splice(itemIndex, 1)
    cart.total = cart.products.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
    }, 0)
    await cart.save()
    res.json({ status: true })
    }catch (err) {
        console.log(err);
        next(err)
    }
}

exports.addToWishlist = async (req, res,next) => {
    const productId = req.params.proId
    try {
        if(req.session.loggedIn){
            const userId = req.session.user._id
        let list = await wishlistModel.findOne({ userId: userId });
        if (list) {
            let itemIndex = list.myWish.findIndex(p => p.productId == productId);
            if (itemIndex > -1) {
                list.myWish.splice(itemIndex, 1)
                await list.save()
                // res.json({ status: true })
            } else {
                list.myWish.push({ productId });
            }
            await list.save()
            res.json({ status: true })
        } else {
            list = new wishlistModel({
                userId: userId,
                myWish: [{ productId }],
            });
            await list.save()
            res.json({ status: true })
        }
        }else{
            res.json({ status:false })

        }
    } catch (err) {
        console.log(err);
        next(err)
    }
}

exports.viewWishlist = async (req, res,next) => {
    console.log("najn ividae und");

 try{
    const userId = req.session.user._id
    const wishlist = await wishlistModel.findOne({ userId: userId }).populate("myWish.productId").exec()
    if (wishlist) {
        req.session.wishlistNumber = wishlist.myWish.length
    }
    const viewcart = await cartModel.findOne({ userId: userId }).populate("products.productId").exec()
    if (viewcart) {
        req.session.cartNumber = viewcart.products.length
    }
    res.render('users/wishlist', { wishproducts: wishlist, wishlistNumber: req.session.wishlistNumber, cartNumber: req.session.cartNumber, user: req.session.user })

 } catch (err) {
    console.log(err);
    next(err)
}
}

exports.deleteWishlistItem = async (req, res,next) => {
    let productId = req.params.proId
    let userId = req.session.user._id
    try{
        let wishlist = await wishlistModel.findOne({ userId });
    let itemIndex = wishlist.myWish.findIndex(p => p._id == productId);
    console.log(itemIndex);
    wishlist.myWish.splice(itemIndex, 1)
    await wishlist.save()
    res.json({ status: true })
    }catch (err) {
        console.log(err);
        next(err)
    }
}

exports.checkOut = async (req, res,next) => {
   
    const userId = req.session.user._id
    try{
        const viewcart = await cartModel.findOne({ userId: userId }).populate("products.productId").exec()
    let userAlldetails = await userModel.findOne({ _id: req.session.user._id })
    // console.log(viewcart);
    if (viewcart) {
        res.render('users/checkout', { cartProducts: viewcart, wishlistNumber: req.session.wishlistNumber, cartNumber: req.session.cartNumber, user: userAlldetails })
    } else {
        res.redirect('/cart')
    }
    }catch (err) {
        console.log(err);
        next(err)
    }
}

exports.placeOrder = async (req, res,next) => {
 
    let userId = req.session.user._id
    let addressIndex=req.body.index
    try{
        let userOne = await userModel.findById(userId)
     let deliveryAddress = {
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        phone: req.body.number,
        address: req.body.address,
        pincode: req.body.pin,
        state: req.body.state,
        district: req.body.district
    }
    if(addressIndex){
        console.log(addressIndex,'index nd');
        console.log('payayth');
        userOne.Address[addressIndex] = deliveryAddress
    }else{
console.log('index illa');
userOne.Address.push(deliveryAddress);
    }
    
    await userOne.save()
    console.log(deliveryAddress);
    const cart = await cartModel.findOne({ userId: userId })
    
    const paymentType = req.body.paymentType
    const newOrder = new orderModel({
        userId: userId,
        deliveryAddress: deliveryAddress,
        products: cart.products,
        total: req.body.total,
        discount:cart.total-req.body.total,
        paymentType: paymentType
    })
    //coupon users add
    if(req.body.total!=cart.total){
        console.log('equal alla');
        let couponId=req.session.couponId
        console.log(couponId,'ithanotoh coupon used iddddd');
        let findCoupon=await couponModel.findById(couponId)
        console.log(findCoupon,'ithann coupon used');
        findCoupon.usedUsers.push({userId})
           await findCoupon.save()
    }else{
        console.log('equal ann');
    }
    cart.products.forEach(async(productId)=>{
        let producttt=await Product.findById(productId.productId)
        producttt.Quantity-=productId.quantity
       await producttt.save()
    })

   
    await cart.remove()
  
    await newOrder.save()
    if (req.session.coupon > 0) {
        req.session.coupon = null
    }
    res.json({ status: true })
    }catch (err) {
        console.log(err);
        next(err)
    }

}

exports.verifyPayment = (req, res,next) => {
    console.log('jjljkjhfdakljhfjdshfkjhdskjfhakj');
    try{
        const orderId = req.params.orderId
    let body = orderId + "|" + req.body.response.razorpay_payment_id;

    const crypto = require("crypto");
    const expectedSignature = crypto.createHmac('sha256', process.env.key_secret)
        .update(body.toString())
        .digest('hex');
    console.log("sig received ", req.body.response.razorpay_signature);
    console.log("sig generated ", expectedSignature);
    let response = { "signatureIsValid": false }
    if (expectedSignature === req.body.response.razorpay_signature) {
        response = { "signatureIsValid": true }
    }
    res.send(response);
    }catch (err) {
        console.log(err);
        next(err)
    }

}

exports.orderSuccessPage = async (req, res,next) => {
    const userId = req.session.user._id
    try{
        const wishlist = await wishlistModel.findOne({ userId: userId }).populate("myWish.productId").exec()
    if (wishlist) {
        req.session.wishlistNumber = wishlist.myWish.length
    }
    const viewcart = await cartModel.findOne({ userId: userId }).populate("products.productId").exec()

    if (viewcart) {
        req.session.cartNumber = viewcart.products.length
    } else {
        req.session.cartNumber = null
    }

    res.render('users/order-success', { cartProducts: viewcart, wishlistNumber: req.session.wishlistNumber, cartNumber: req.session.cartNumber, user: req.session.user })

    }catch (err) {
        console.log(err);
        next(err)
    }
}
exports.getOrder = async (req, res,next) => {
    try {
        const userId = req.session.user._id
        const myOrders = await orderModel.find({ userId }).populate([
            {
                path: "userId",
                model: "user"
            },
            {
                path: "products.productId",
                model: "product"
            }
        ]).exec()
        // console.log(myOrders, "hjhgfjhdgjh");
        res.render('users/orders', { myOrders: myOrders, wishlistNumber: req.session.wishlistNumber, cartNumber: req.session.cartNumber, user: req.session.user })

        //   res.render('user/orders',{myOrders:myOrders})

    } catch (error) {
        console.log(error);
        next(err)

    }
}

exports.redeemCoupnAmount = async (req, res,next) => {
const userId=req.session.user._id
    const coupCode = req.params.coupCode
    const totalAmount = req.params.total
    try {
        const coupon = await couponModel.findOne({ couponCode: coupCode }).lean().exec()
        console.log(coupon,'coupon');
    
        
        if (coupon) {
            
        req.session.couponId=coupon._id
        console.log(coupon.usedUsers,'1');
        console.log(userId);
            if (coupon.usedUsers.filter(e => e.userId.toString() === userId).length > 0) {
                console.log('unddddddddd');
                res.json({ alreadyApplied: true })
              }else{
                let nw = new Date()
                let str = nw.toJSON().slice(0, 10)
                let coustr = coupon.expDate.toJSON().slice(0, 10)
                if (coupon.isActive && str <= coustr) {
    
                    if (!req.session.coupon) {
                        if (totalAmount >= coupon.minPurchase) {
                            res.json(coupon)
                            req.session.coupon = 1
                           
                            console.log(req.session.couponId,'itan coupn id');
                         
                        } else {
                            res.json({ minimunPurchase: true })
                        }
                    } else {
                        res.json({ alreadyApplied: true })
                    }
                } else {
                    res.json({ expired: true })
                }
                console.log('ilaaaaaa');
              }
        } else {
            res.json({ invalidCoupon: true })
        }
    } catch (err) {
        console.log(err);
        next(err)
    }
}

exports.generateOrder = (req, res,next) => {
    const amount = parseInt(req.body.amount) * 100
    const options = {
        amount: amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order1001"
    };
    instance.orders.create(options, function (err, order) {
        if (err) {
            console.log(err)
        } else {
            res.send({ orderId: order.id })
        }
    });
}

exports.addAndEditAddress = async (req, res,next) => {
    let addrexIndex = parseInt(req.body.index)
    let _id = req.session.user._id
    try{
        let userOne = await userModel.findById(_id)
    console.log(userOne.Address[2]);
    let address = {
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        phone: req.body.phone,
        address: req.body.address,
        pincode: req.body.pincode,
        state: req.body.state,
        district: req.body.district
    }
    if (addrexIndex > -1) {
        console.log('payayth');
        userOne.Address[addrexIndex] = address
    } else {
        userOne.Address.push(address);
    }



    // console.log(userOne);

    await userOne.save()
    res.json({status:true})
    }catch (err) {
        console.log(err);
        next(err)
    }
}

exports.deleteAddress = async (req, res,next) => {
    const userId = req.session.user._id
    const addressIndex = req.params.addresIndex
 try{
    const userOne = await userModel.findById(userId)
    userOne.Address.splice(addressIndex, 1)
    await userOne.save()
    res.json({ status: true })
 }catch (err) {
    console.log(err);
    next(err)
}


}

exports.cancelOrder=async(req,res,next)=>{
    console.log(req.params.orderId,'jkfhdjfd111');
    let orderId=req.params.orderId
   try{
    await orderModel.findByIdAndUpdate(orderId,{
        orderActive:false})
        res.json({ status: true })
   }catch (err) {
    console.log(err);
    next(err)
}
}

exports.addNotifyProduct=async(req,res,next)=>{
 try{
    let proId=req.body.ProductId 
    let notifyProduct = new notifyModel({
         email: req.body.Email,
         productId:proId ,
     });
 
     await notifyProduct.save()
     res.json({ status: true })
 }catch (err) {
    console.log(err);
    next(err)
}

}

exports.getInvoice=async(req,res,next)=>{
    console.log(req.params.orderId,'orderiddd');
    let orderId=req.params.orderId
   try{
    let billData=await orderModel.findById(orderId).populate("products.productId").exec()
    console.log(billData,'billdataaa');
    res.render('users/get-Invoice',{ billData, wishlistNumber: req.session.wishlistNumber, cartNumber: req.session.cartNumber, user: req.session.user })

   }catch (error) {
   next(err)
}
}

exports.changePasswordOtp=async(req,res,next)=>{
    try{
        let userData=req.session.user
    let data = await twilioHelpers.doSms(userData)
    }catch (err) {
        console.log(err);
        next(err)
    }
 
}

exports.changePassword=async(req,res,next)=>{
    let user=req.session.user
  try{
    let match=await bcrypt.compare(req.body.oldPassword, user.Password)
    if(match){
        req.body.newPassword = await bcrypt.hash(req.body.newPassword, 10)
        let result = await twilioHelpers.otpVerify(req.body, user)
        if(result){
            await userModel.findByIdAndUpdate(user._id,{
                Password:req.body.newPassword})
                res.json({update:true})
        }else{
            res.json({otpVerifyErr:true})
        }
    }else{
        res.json({oldPasswordErr:true})
    }
  }catch (err) {
    console.log(err);
    next(err)
}
}

exports.contactPage=(req,res,next)=>{
    res.render('users/contact-giftto',{wishlistNumber: req.session.wishlistNumber, cartNumber: req.session.cartNumber, user: req.session.user})
}

exports.messageInsert=async(req,res,next)=>{
    console.log(req.body);
  try{
    let messageDetail={
        email:req.body.email1,
        message:req.body.msg
    }

    let admin=await adminModel.findOne({})
    admin.ctMessages.push(messageDetail)
    await admin.save()
res.json({status:true})
  }catch (err) {
    console.log(err);
   next(err)
}
    

}


exports.addReviews=async(req,res)=>{
    try{
        let proId=req.body.proId
    let review={
        rating:parseInt(req.body.rating),
        name:req.body.name,
        email:req.body.email3,
        review:req.body.review
    }
    let product=await Product.findById(proId)
    product.reviews.push(review)
    product.save()
    res.json({status:true})
    }catch (err) {
        console.log(err);
       next(err)
    }
    
}

exports.userLogout = ((req, res,next) => {
    req.session.loggedIn=false
    req.session.user=null
    res.redirect('/')
})
