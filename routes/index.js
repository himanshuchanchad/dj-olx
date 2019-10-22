const express = require("express");
const router = express.Router()
const path=require("path");
const db =require("./../utils/database");
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        req.user.orderCount += 1;
        let name = req.user.username+'.'+req.user.orderCount+'.'+file.mimetype.split('/')[1];
        req.user.prescription.push(name);
        cb(null, name);
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
// res.sendFile(path.join(__dirname,'../', "templates","index.ejs"));
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
        console.log(sql);
        const [rows,fields]=await db.execute(sql);
        const user = rows[0];
        console.log(user);
        res.render('home',{
            }
            );

    } catch (error) {
        res.render('signup',
        {
        signupError :true,
        });
        console.log(error);
    }
});

router.get("/home",async (req,res,next)=>{
    const sql=`select * from items`;
    try {
        const [rows,fields]=await db.execute(sql);
        const items = rows;

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
    const image=req.file;
    const imageUrl = image.path;
    const sql=`insert into items(title,description,image,price,condition)values('${req.body.title}','${req.body.description}','${imageUrl}','${req.body.price}','${req.body.condition}')`;
    try {
        const [rows,fields]=await db.execute(sql);
        res.render('home',{
        }
        );
    } catch (error) {
        
    }
    res.render('add-items',{
    });
});


module.exports=router;