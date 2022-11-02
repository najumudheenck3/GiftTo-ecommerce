var express = require('express');
var router = express.Router();
const adminRouter=require('../controllers/adminRouter')
const store=require('../middleware/multer')
const bannerStore=require('../middleware/bannermulter')

router.route('/').get(adminRouter.adminLogin).post(adminRouter.adminpostLogin)

// router.get('/dashboard',(req,res,next)=>{
//     res.render('admin/dashboard')
// })

router.route('/view-products').get(adminRouter.viewAllProducts)

router.route('/add-product').get(adminRouter.addProduct).post(store.array('Image',3),adminRouter.postAddProduct)

router.route('/edit-product/:id').get(adminRouter.editProduct).post(store.array('Image',3),adminRouter.postEditProduct)

router.route('/delete-product/:proId').post(adminRouter.productStatus)

router.route('/view-users').get(adminRouter.viewAllUsers)

router.route('/user-status/:id').post(adminRouter.userStaus)

router.route('/view-category').get(adminRouter.viewAllCategory).post(adminRouter.postAllCategory)

router.route('/category-products/:catName').get(adminRouter.categoryWiseProducts)

router.route('/view-coupen').get(adminRouter.viewAllCoupens).post(adminRouter.addCoupen)

router.route('/coupon-status/:couponId').post(adminRouter.couponStatusChange)

router.route('/view-orders').get(adminRouter.getAllOrders)

router.route('/cancel-order/:orderId').post(adminRouter.cancelOrder)

router.route('/status-order/:orderId/:status').post(adminRouter.orderStatusChange)

router.route('/view-banners').get(adminRouter.getAllBAnners).post(bannerStore.array('image',1),adminRouter.addBanner)

router.route('/banner-status/:bannerId').post(adminRouter.bannerStatusChange)

router.route("/getGraphDetails").get(adminRouter.getGraphDetails)


router.get('/signout',(req,res)=>{
    req.session.destroy()
    res.redirect('/admin')
})




module.exports = router;