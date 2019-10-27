const express = require("express");
const router = express.Router()
const indexRoutes = require('./../controllers/index');
const multer = require('multer');
const is_authenticated = require('./../utils/is_auth').is_authenticated;

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'static/images');
    },
    filename: (req, file, cb) => {
        req.imageURLNew =  file.originalname;
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if( file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
var upload = multer({storage, fileFilter});

router.get("/",indexRoutes.main_page);
router.post("/login",indexRoutes.loginCheck);
router.get("/signup",indexRoutes.get_signup);
router.post("/signup",indexRoutes.signup);
router.get("/home",is_authenticated,indexRoutes.home);
router.get("/add-items",is_authenticated,indexRoutes.get_add_items);
router.post("/add-items",is_authenticated,upload.single('image'),indexRoutes.add_items);
router.get("/logout",indexRoutes.logout);
router.get("/manage-items",is_authenticated,indexRoutes.manage_items);
router.get("/deactivate-items",is_authenticated,indexRoutes.deactivate_items);
router.get("/items",is_authenticated,indexRoutes.items);


module.exports=router;