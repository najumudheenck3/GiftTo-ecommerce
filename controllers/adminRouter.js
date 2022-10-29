const mongoose = require('mongoose');
const Product=require('../models/productSchema')
const user=require('../models/userSchema')
const category=require('../models/categorySchema')
const couponModel=require('../models/coupenSchema')




exports.adminLogin=(req,res,next)=>{
    if(req.session.loggedInAdmin){
        res.render('admin/dashboard')
        // res.redirect('/admin/dashboard')
    }else{
        res.render('admin/login',{message:req.flash('message')})

    }
}

const aEmail="admin@gmail.com"
const aPassword="123"

exports.adminpostLogin=(req,res,next)=>{
    console.log(req.body);
    const data = {
        email: req.body.Email,
        password: req.body.Password,
      };
      if (data.email === aEmail && data.password === aPassword){
        req.session.loggedInAdmin = true;
        res.redirect('/admin')
        // res.render('admin/dashboard')
      }else{
        req.flash('message','Invalid Username or Password')
        res.redirect('/admin')
      }
}

exports.viewAllProducts=(req,res,next)=>{
    Product.find({},(err,data)=>{
        if(err){
            console.log(err);
        }else{
            res.render('admin/view-products',{products:data})
        }
   
    // console.log(data);
})
}

exports.addProduct=(req,res,next)=>{
    category.find({},(err,data)=>{
        if(err){
            console.log(err);
        }else{
            res.render('admin/add-product',{category:data})
        }
   
})
}


exports.postAddProduct=(req,res,next)=>{
    const Images=[];
    console.log(req.files);
    for(i=0;i<req.files.length;i++){
        Images[i]=req.files[i].filename;
    }
    req.body.Image=Images
    console.log(req.body);
    const product=new Product({
                Name:req.body.Name,
                Category:req.body.Category,
                Cost:req.body.CostPrice,
                Price:req.body.Price,
                Description:req.body.Description,
                Quantity:req.body.Quantity,
                Images:req.body.Image
            })
            product.save().then(()=>{
                // image=req.files.Image
                // image.mv('./public/productimages/'+data._id+'.png',(err,data)=>{
                //     if(!err){
                        res.redirect('/admin/add-product')
                //     }else{
                //         console.log(err);
                //     }
                // })
                
            })
}


exports.editProduct=(req,res,next)=>{
    // console.log(req.params.id);
    Product.findOne({_id:req.params.id},(err,data)=>{
        // console.log(data);
category.find({},(err,data1)=>{
    // console.log(data1);
    res.render('admin/edit-product',{product:data,category:data1})

})
        // if(err){
        //     console.log(err);
        // }else{
            // res.render('admin/edit-product',{product:data})
        // }
    })
    
}

exports.postEditProduct=(req,res,next)=>{
    console.log(req.body);
    const Images=[];
    for(i=0;i<req.files.length;i++){
        Images[i]=req.files[i].filename;
    }
    req.body.Image=Images
    if(req.files.length>0){
        Product.updateOne({_id:req.params.id},{$set:{
            Name:req.body.Name,
            Category:req.body.Category,
            Description:req.body.Description,
            Cost:req.body.CostPrice,
            Price:req.body.Price,
            Quantity:req.body.Quantity,
            Images:req.body.Image
        }}).then(()=>{
            res.redirect('/admin/view-products')
        })
    }else{
        Product.updateOne({_id:req.params.id},{$set:{
            Name:req.body.Name,
            Category:req.body.Category,
            Description:req.body.Description,
            Cost:req.body.CostPrice,
            Price:req.body.Price,
            Quantity:req.body.Quantity
        }}).then(()=>{
            res.redirect('/admin/view-products')
        })
    }
    
   
}

// exports.deleteProduct=(req,res,next)=>{
//     console.log(req.params.id);
//     let proId=req.params.id
//     Product.deleteOne({_id:proId}).then(()=>{
//         res.json({status:true})
//     })
    
// }

exports.productStatus=(req,res,next)=>{
    console.log('ividund');
    let proId=req.params.proId
    console.log(proId);
    Product.findOne({_id:proId},(err,data)=>{
        if(!err){
            console.log(data);
            console.log(data.productActive);
            if(data.productActive){
                console.log(proId);
                Product.updateOne({_id:proId},{$set:{productActive:false}}).then(()=>{
                    res.json({status:true})
                })
            }else{
                
                Product.updateOne({_id:proId},{$set:{productActive:true}}).then(()=>{
                    res.json({status:true})
                })
            }
        }else{
            console.log(err);
        }
    })
}


exports.viewAllUsers=(req,res,next)=>{
    user.find({},(err,data)=>{
        if(err){
            console.log(err);
        }else{
            res.render('admin/view-users',{users:data})
        }
   
})
}

exports.userStaus=(req,res,next)=>{
    let userId=req.params.id
    console.log(userId);
    user.findOne({_id:userId},(err,data)=>{
        if(!err){
            console.log(data);
            if(data.giftUser){
                console.log(userId);
                user.updateOne({_id:userId},{$set:{giftUser:false}}).then(()=>{
                    res.json({status:true})
                })
            }else{
                console.log(userId);
                user.updateOne({_id:userId},{$set:{giftUser:true}}).then(()=>{
                    res.json({status:true})
                })
            }
        }else{
            console.log(err);
        }
    })
}

exports.viewAllCategory=(req,res,next)=>{
    category.find({},(err,data)=>{
        if(err){
            console.log(err);
        }else{
            res.render('admin/view-category',{category:data,message:req.flash('message')})
        }
   
})

}

exports.postAllCategory=(req,res,next)=>{
    let newCategory = req.body.Category.toUpperCase()
    console.log(newCategory);
    category.find({CategoryName:newCategory},(err,data)=>{
        console.log(data.length);
            if(data.length===0){
                console.log('hiii');
                let Category=new category({
                    CategoryName:newCategory
                })
                Category.save().then(()=>{
                    res.redirect('/admin/view-category')
                })
                
            }else{
                console.log('und');
                req.flash('message', 'Category already exist')
                res.redirect('/admin/view-category')
            }
    })
   
    
}

exports.categoryWiseProducts=(req,res,next)=>{
    // console.log(req.params.catName);
    let catName=req.params.catName
    Product.find({Category:catName}).then((data)=>{
        res.render('admin/categoryProducts',{products:data})

    })
}

exports.viewAllCoupens=async(req,res)=>{
    try {
        const coupon = await couponModel.find()
        res.render('admin/view-coupens',{coupon})
        // res.render("admin/coupon-manage", { coupon, layout: 'layout/usermanage-layout' })
  
      } catch (error) {
        console.log(error);
  
      }
 
}

exports.addCoupen=async (req,res)=>{
    console.log(req.body);
    const { name, couponCode, discount, maxLimit, minPurchase, expDate } = req.body
    try {
      await couponModel.create({
        name: name.toUpperCase(),
        couponCode: couponCode.toUpperCase(),
        discount,
        maxLimit,
        minPurchase,
        expDate
      })
      res.redirect('back')

    } catch (error) {
      console.log(error);

    }
}

exports.couponStatusChange=async(req,res)=>{
    console.log(req.params.couponId);
    let couponId = req.params.couponId
    try {
        let coupon=await couponModel.findOne({_id:couponId})
        // console.log(coupon);
        if(coupon.isActive){
            couponModel.updateOne({_id:couponId},{$set:{isActive:false}}).then(async()=>{
                res.json({status:true})
            })
        }else{
            couponModel.updateOne({_id:couponId},{$set:{isActive:true}}).then(async()=>{
                res.json({status:true})
            })
        }
      } catch (err) {
        console.log(err);
        // res.redirect('back')
      }
}