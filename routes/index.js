const express = require("express");
const router = express.Router()
const path=require("path");
const db =require("./../utils/database");
const multer = require('multer');

let imageURLNew;
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
        // let name = makeid(10)+'.'+file.mimetype.split('/')[1];
        imageURLNew =  file.originalname;
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

router.get("/",(req,res,next)=>{
res.render('index',{
    loginError : false,
});
});
router.post("/login",async (req,res,next)=>{ 

    const sql =`select * from user where sap_id ='${req.body.username}' and password ='${req.body.password}'`;
    try {
    const [rows,fields] =  await db.execute(sql);
    const user = rows[0];
    if(user == undefined)
    {
        res.render('index',{
        loginError : true,
        }
        );
    }
    else{
        res.redirect("/home");
    }
    } catch (error) {
        console.log(error);
    } 
});

router.get("/signup",(req,res,next)=>{
    res.render('signup',{
        signupError :false,
    });
});

router.post("/signup",async (req,res,next)=>{
    const sql =`insert into user(sap_id,password,firstname,middlename,lastname,department,phoneno,email) values(${req.body.sap_id},'${req.body.password}','${req.body.firstname}','${req.body.middlename}','${req.body.lastname}','${req.body.department}',${req.body.phoneno},'${req.body.email}')`;
    try {
        const [rows,fields]=await db.execute(sql);
        const user = rows[0];
        res.render('index',{
            loginError : false,
        });
    } catch (error) {
        res.render('signup',
        {
        signupError :true,
        });
        console.log(error);
    }
});

router.get("/home",async (req,res,next)=>{
    let query=req.query.search;
    let sql;
    if(query)
    {
         sql =`select *  from items where title like '%${query}%' or description like '%${query}%'`;
    }
    else{
     sql=`select * from items`;
    }
    console.log(sql);
    let items;
    try {
        const [rows,fields]=await db.execute(sql);
         items = rows;

    } catch (error) {
        
    }
    
    res.render('home',{
        items : items ,
    });
});



router.get("/add-items",(req,res,next)=>{
    res.render('add-items',{
    });
});

router.post("/add-items",upload.single('image'),async (req,res,next)=>{
    const sql=`insert into items(title,description,image,price,conditions) values('${req.body.title}','${req.body.description}','${imageURLNew}',${req.body.price},'${req.body.condition}')`;
    try {
        const [rows,fields]=await db.execute(sql);
        res.redirect('/home');
    } catch (error) {
        console.log(error);
        res.render('add-items',{
        });
    }
});


module.exports=router;