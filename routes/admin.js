var express = require('express');
var router = express.Router();
const adminRouter=require('../controllers/adminRouter')
const store=require('../middleware/multer')
const bannerStore=require('../middleware/bannermulter')

/* For Admin Session  */
const verifyAdmin = ((req, res, next) => {
    if (req.session.loggedInAdmin) {
      next()
    } else {
      res.redirect('/admin')
    }
  })

router.route('/').get(adminRouter.adminLogin).post(adminRouter.adminpostLogin)

router.route('/view-products').get(verifyAdmin,adminRouter.viewAllProducts)

router.route('/add-product').get(verifyAdmin,adminRouter.addProduct).post(store.array('Image',3),adminRouter.postAddProduct)

router.route('/edit-product/:id').get(verifyAdmin,adminRouter.editProduct).post(store.array('Image',3),adminRouter.postEditProduct)

router.route('/delete-product/:proId').post(adminRouter.productStatus)

router.route('/view-users').get(verifyAdmin,adminRouter.viewAllUsers)

router.route('/user-status/:id').post(adminRouter.userStaus)

router.route('/view-category').get(verifyAdmin,adminRouter.viewAllCategory).post(adminRouter.postAllCategory)

router.route('/category-products/:catName').get(verifyAdmin,adminRouter.categoryWiseProducts)

router.route('/category-status/:catId').post(adminRouter.categoryStatusChange)

router.route('/view-coupen').get(verifyAdmin,adminRouter.viewAllCoupens).post(adminRouter.addCoupen)

router.route('/coupon-status/:couponId').post(adminRouter.couponStatusChange)

router.route('/view-orders').get(verifyAdmin,adminRouter.getAllOrders)

router.route('/cancel-order/:orderId').post(adminRouter.cancelOrder)

router.route('/status-order/:orderId/:status').post(adminRouter.orderStatusChange)

router.route('/view-banners').get(verifyAdmin,adminRouter.getAllBAnners).post(bannerStore.array('image',1),adminRouter.addBanner)

router.route('/banner-status/:bannerId').post(adminRouter.bannerStatusChange)

router.route("/getGraphDetails").get(verifyAdmin,adminRouter.getGraphDetails)

router.route('/sales-report').get(verifyAdmin,adminRouter.salesReport)

router.route('/get-invoice/:orderId').get(verifyAdmin,adminRouter.getInvoice)


router.get('/signout',(req,res)=>{
    req.session.destroy()
    res.redirect('/admin')
})

/* For Admin Error Page */
router.use(function (req, res, next) {
    next(createError(404));
  });
  
  router.use(function (err, req, res, next) {
    console.log("admin error route handler")
    res.status(err.status || 500);
    res.render('admin/admin-error');
  });



module.exports = router;