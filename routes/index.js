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
        res.cookie("sap_id", req.body.username); 
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
    if(req.password==null){
        let sql1 =`insert into user(sap_id,password,firstname,middlename,lastname,department,phoneno,email) values(${req.body.sap_id},'pass@123','${req.body.firstname}','${req.body.middlename}','${req.body.lastname}','${req.body.department}',${req.body.phoneno},'${req.body.email}')`;
    try {
        const [rows,fields]=await db.execute(sql1);
        const user = rows[0];
        await db.execute(`insert into buyer(sap_id ) values(${req.body.sap_id})`);
        await db.execute(`insert into seller(sap_id ) values(${req.body.sap_id})`);
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

    }
    else{

    let sql1 =`insert into user(sap_id,password,firstname,middlename,lastname,department,phoneno,email) values(${req.body.sap_id},'${req.body.password}','${req.body.firstname}','${req.body.middlename}','${req.body.lastname}','${req.body.department}',${req.body.phoneno},'${req.body.email}')`;
    try {
        const [rows,fields]=await db.execute(sql1);
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
}
});

router.get("/home",async (req,res,next)=>{
    let query=req.query.search;
    let sql;
    
    if(query)
    {
         sql =`select *  from items where active =1  and  (title like '%${query}%' or description like '%${query}%' )`;
    }
    else{
     sql=`select * from items where active =1`;
    }
    // console.log(sql);
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
    const sql=`insert into items(sap_id,title,description,image,price,conditions) values('${req.cookies.sap_id}','${req.body.title}','${req.body.description}','${imageURLNew}',${req.body.price},'${req.body.condition}')`;
    try {
        const [rows,fields]=await db.execute(sql);
        res.redirect('/home');
    } catch (error) {
        console.log(error);
        res.render('add-items',{
        });
    }
});
router.get("/logout",(req,res,next)=>{
    res.clearCookie("sap_id");
    res.redirect("/");
});
router.get("/manage-items", async (req,res,next)=>{
    let sql=`select * from items where active =1 and sap_id =${req.cookies.sap_id}`;
    let sql1= `select * from  user  where sap_id=${req.cookies.sap_id}`;
    console.log(sql);
    
    let items;
    try {
        const [rows,fields] =await db.execute(sql);
        items=rows
        let [row,field] = await db.execute(sql1);
        user = row[0]
        res.render('manage-items',{
            items: items,
            user : user,
        });
    } catch (error) {
        console.log(error);
        
    }
    res.redirect("/home");
});

router.get("/deactivate-items",async (req,res,next)=>{
    let query=req.query.search;
    let sql=`update items set active=0 where items_id=${query}`;
    try {
        let [row,field] = await db.execute(sql);
        res.redirect("/manage-items");
    } catch (error) {
        
    }
    res.redirect("/home");
});
router.get("/items",async (req,res,next)=>{
    let query=req.query.search;
    let sql= `select * from  user  where sap_id =(select sap_id from items where items_id =${query})`;
    const sql2 = `select * from items where active=1 and  items_id =${query}`;
    let item,user;
    try {
        let [rows,fields]=await db.execute(sql2);
         item = rows[0];
         let [row,field]=await db.execute(sql);
         user = row[0];
         console.log(item,user);
    } catch (error) {
        console.log(error);
        
    }
    res.render('items',{
        item: item,
        user : user ,
    });
});


module.exports=router;