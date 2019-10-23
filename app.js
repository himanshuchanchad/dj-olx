const express= require("express");
const app=express();
const indexRoutes=require("./routes/index");
const bodyParser = require('body-parser');
const path =require('path');
let cookieParser = require('cookie-parser'); 

app.set('view engine', 'ejs');
app.set('views','templates');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'static')));
app.use(cookieParser());
app.use('/',indexRoutes);

app.use((req,res,next)=>{
res.status(404).sendFile(path.join(__dirname,'templates','404.html'));
});



app.listen(3000);