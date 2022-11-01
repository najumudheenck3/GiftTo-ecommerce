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


const instance = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret,
});




exports.userHome = async (req, res) => {
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
    Product.find({ productActive: true }, (err, data) => {
        // console.log(data);
        res.render('users/home', { user, Category, cartNumber, wishlistNumber, products: data })
    })
}

exports.shopProducts = async (req, res) => {
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
    console.log(cartNumber);
    let Category = await category.find({})
    let products = await Product.find({ productActive: true })
    console.log(products);

    res.render('users/shop-products', { user, Category, cartNumber, wishlistNumber, products })
}

exports.getMyProfile = async (req, res) => {
    let user = req.session.user
    // console.log(user,'ith thanda user');
    let cartNumber = req.session.cartNumber
    let wishlistNumber = req.session.wishlistNumber
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
}

exports.categoryWiseProducts = async (req, res) => {
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
    let categoryName = req.query.category
    let categoyProducts = await Product.find({ Category: categoryName })
    let Category = await category.find({})
    res.render('users/category-products', { user, Category, cartNumber, wishlistNumber, products: categoyProducts })
    console.log(categoyProducts);

}

exports.userLogin = (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/')
    } else {
        res.render('users/login', { message: req.flash('message') })
    }
}

exports.userpostLogin = (req, res) => {
    // console.log(req.body);
    const loginData = {
        Email: req.body.Email,
        Password: req.body.Password
    }
    console.log(loginData);
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
                            console.log(req.session.cartNumber);
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


}

exports.userSignup = (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/')
    } else {
        res.render('users/signup', { message: req.flash('message') })

    }
}

exports.userpostSignup = (req, res) => {

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
}

exports.otpget = (req, res, next) => {
    if (req.session.loggedIn) {
        res.redirect('/')
    } else {
        res.render('users/otp', { errOtp: req.flash('errOtp') })

    }
}

exports.postget = async (req, res, next) => {
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
}


exports.viewOneProduct = async (req, res) => {
    // console.log(req.params.id);
    let proId = req.params.id
    Product.findOne({ _id: proId }, async (err, data) => {
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
        console.log(relatedProducts);
        // console.log(data);
        res.render('users/oneproductdetail', { user: req.session.user, relatedProducts, wishlistNumber: req.session.wishlistNumber, cartNumber: req.session.cartNumber, product: data })

    })
}

exports.addToCart = async (req, res) => {
    const productId = req.params.proId
    const quantity = parseInt(req.params.qty)

    try {
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
            // res.status(201).json({ message: "cart item updated" })
        } else {
            res.json({ status: true })

            // return res.status(200).json({ message: "item not available" })
        }
    } catch (err) {
        console.log(err);
        res.json({ status: true })

        //   res.status(500).send({ err });
    }
}


exports.viewCart = async (req, res) => {
    const userId = req.session.user._id
    const viewcart = await cartModel.findOne({ userId: userId }).populate("products.productId").exec()
    if (viewcart) {
        req.session.cartNumber = viewcart.products.length
    }
    const wishlist = await wishlistModel.findOne({ userId: userId }).populate("myWish.productId").exec()
    if (wishlist) {
        req.session.wishlistNumber = wishlist.myWish.length

    }
    // console.log(viewcart);
    // console.log(viewcart.products[0].productId.Images);
    // const cartproduct=viewcart.products.length
    // console.log(viewcart.products.length);
    // req.session.cartNumber=viewcart.products.length
    // console.log(cartproduct);
    res.render('users/cart', { cartProducts: viewcart, wishlistNumber: req.session.wishlistNumber, cartNumber: req.session.cartNumber, user: req.session.user })
}


exports.changeQuantity = async (req, res) => {
    console.log("hooou");
    console.log(req.params.proId);
    let productId = req.params.proId.toString()
    let changeStatus = req.params.changeStatus
    console.log(changeStatus);
    let userId = req.session.user._id
    console.log(userId);
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

}

exports.deleteCartItem = async (req, res) => {
    console.log(req.params.proId);
    let productId = req.params.proId
    let userId = req.session.user._id
    let cart = await cartModel.findOne({ userId });
    let itemIndex = cart.products.findIndex(p => p._id == productId);
    cart.products.splice(itemIndex, 1)
    cart.total = cart.products.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
    }, 0)
    await cart.save()
    res.json({ status: true })
}

exports.addToWishlist = async (req, res) => {
    console.log(req.params.proId);
    const productId = req.params.proId
    try {
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
    } catch (err) {
        // console.log(err);
        res.json({ status: true })
    }
}

exports.viewWishlist = async (req, res) => {
    console.log("najn ividae und");

    const userId = req.session.user._id
    const wishlist = await wishlistModel.findOne({ userId: userId }).populate("myWish.productId").exec()
    if (wishlist) {
        req.session.wishlistNumber = wishlist.myWish.length
    }
    const viewcart = await cartModel.findOne({ userId: userId }).populate("products.productId").exec()
    if (viewcart) {
        req.session.cartNumber = viewcart.products.length
    }
    // console.log(wishlist);
    // console.log(req.session.wishlistNumber);
    res.render('users/wishlist', { wishproducts: wishlist, wishlistNumber: req.session.wishlistNumber, cartNumber: req.session.cartNumber, user: req.session.user })

}

exports.deleteWishlistItem = async (req, res) => {
    console.log(req.params.proId, "ithanbnnnnn");
    let productId = req.params.proId
    let userId = req.session.user._id
    let wishlist = await wishlistModel.findOne({ userId });
    let itemIndex = wishlist.myWish.findIndex(p => p._id == productId);
    console.log(itemIndex);
    wishlist.myWish.splice(itemIndex, 1)
    await wishlist.save()
    res.json({ status: true })
}

exports.checkOut = async (req, res) => {
    const userId = req.session.user._id
    const viewcart = await cartModel.findOne({ userId: userId }).populate("products.productId").exec()
    let userAlldetails = await userModel.findOne({ _id: req.session.user._id })
    // console.log(viewcart);
    if (viewcart) {
        res.render('users/checkout', { cartProducts: viewcart, wishlistNumber: req.session.wishlistNumber, cartNumber: req.session.cartNumber, user: userAlldetails })
    } else {
        res.redirect('/cart')
    }
}

exports.placeOrder = async (req, res) => {
    let userId = req.session.user._id
    console.log('hjhioio');
    console.log(req.body);
    let addressIndex=req.body.index
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
    console.log(cart.quantity);
    const paymentType = req.body.paymentType
    const newOrder = new orderModel({
        userId: userId,
        deliveryAddress: deliveryAddress,
        products: cart.products,
        quantity: cart.quantity,
        total: cart.total,
        paymentType: paymentType
    })
    await cart.remove()
    await newOrder.save()
    if (req.session.coupon > 0) {
        req.session.coupon = null
    }
    res.json({ status: true })

}

exports.verifyPayment = (req, res) => {
    console.log('jjljkjhfdakljhfjdshfkjhdskjfhakj');
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

}

exports.orderSuccessPage = async (req, res) => {
    const userId = req.session.user._id
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
}
exports.getOrder = async (req, res) => {
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

    }
}

exports.redeemCoupnAmount = async (req, res) => {
    const coupCode = req.params.coupCode
    const totalAmount = req.params.total
    try {
        const coupon = await couponModel.findOne({ couponCode: coupCode }).lean().exec()
        if (coupon) {
            let nw = new Date()
            let str = nw.toJSON().slice(0, 10)
            let coustr = coupon.expDate.toJSON().slice(0, 10)
            if (coupon.isActive && str <= coustr) {

                if (!req.session.coupon) {
                    if (totalAmount >= coupon.minPurchase) {
                        res.json(coupon)
                        req.session.coupon = 1
                        //    let userId = req.session.user._id
                        //    _id=coupon._id
                        //    console.log(_id);
                        //    let cc= await couponModel.findById({ _id });
                        //    console.log(cc,'jjjj');
                        //    cc.usedUsers.push({userId})
                        //    await cc.save()

                    } else {
                        res.json({ minimunPurchase: true })
                    }
                } else {
                    res.json({ alreadyApplied: true })
                }
            } else {
                res.json({ expired: true })
            }

        } else {
            res.json({ invalidCoupon: true })
        }
    } catch (err) {
        console.log(err);
    }
}

exports.generateOrder = (req, res) => {
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

exports.addAndEditAddress = async (req, res) => {
    console.log(req.body);
    let addrexIndex = parseInt(req.body.index)
    let _id = req.session.user._id
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
}

exports.deleteAddress = async (req, res) => {
    const userId = req.session.user._id
    const addressIndex = req.body.addresIndex
    const userOne = await userModel.findById(userId)
    userOne.Address.splice(addressIndex, 1)
    await userOne.save()
    res.json({ status: true })


}

exports.cancelOrder=async(req,res)=>{
    console.log(req.params.orderId,'jkfhdjfd111');
    let orderId=req.params.orderId
   await orderModel.findByIdAndUpdate(orderId,{
        orderActive:false})
        res.json({ status: true })
}

exports.addNotifyProduct=async(req,res)=>{
    let proId=req.body.ProductId 
   let notifyProduct = new notifyModel({
        email: req.body.Email,
        productId:proId ,
    });

    await notifyProduct.save()
    res.json({ status: true })

}

exports.userLogout = ((req, res) => {
    req.session.destroy()
    res.redirect('/')
})
