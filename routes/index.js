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
        signupError :false,
    });
});
router.post("/signup",async (req,res,next)=>{
    const sql =`insert into user(sap_id,password,firstname,middlename,lastname,department,phoneno,email) values(${req.body.sap_id},'${req.body.password}','${req.body.firstname}','${req.body.middlename}','${req.body.lastname}','${req.body.department}',${req.body.phoneno},'${req.body.email}')`;
    try {
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

router.get("/home",(req,res,next)=>{
    res.render('home ',{
    });
});



module.exports=router;