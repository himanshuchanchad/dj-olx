const express = require("express");
const router = express.Router()
const path=require("path");
const db =require("./../utils/database");


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
    });
});
router.post("/signup",(req,res,next)=>{
    // res.render('signup',{
    // });
});

router.get("/home",(req,res,next)=>{
    res.render('home ',{
    });
});



module.exports=router;