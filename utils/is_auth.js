exports.is_authenticated=(req,res,next) =>{
    if(req.cookies.sap_id != undefined)
    {
        return next();
        
    }
    else{
        res.redirect("/");
    }
    
}