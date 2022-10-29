const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/productimages')
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //   cb(null, file.fieldname + '-' + uniqueSuffix)
    const ext=file.originalname.substr(file.originalname.lastIndexOf('.'))
    cb(null,file.fieldname+'-'+Date.now()+ext)
    }
  })
  
const store = multer({ storage: storage })

  module.exports=store