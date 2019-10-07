const express= require("express");
const app=express();
const adminRoutes=require("./routes/admin");
const bodyParser = require('body-parser');
const path =require('path');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'static')));

app.use('/admin',adminRoutes);

app.use((req,res,next)=>{
res.status(404).sendFile(path.join(__dirname,'templates','404.html'));
});



app.listen(3000);