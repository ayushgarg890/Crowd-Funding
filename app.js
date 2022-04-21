const express=require('express');
 const req = require('express/lib/request');
const morgan=require('morgan');
const mongoose=require('mongoose'); 
const { redirect } = require('express/lib/response');
const async = require('hbs/lib/async');
const User = require('./models/registers');
const FundRaiser = require('./models/fundraiser');
const category = require('./models/category');
const jwt=require('jsonwebtoken');
const fundraiser = require('./models/fundraiser');
const session=require('express-session');
const cookieParser = require("cookie-parser");
const { each, forEach } = require('lodash');
const MongoDB_URL = "mongodb+srv://elixiruser:Qf3cBcDQ37x7aMmD@elixirfunds.c4822.mongodb.net/ExilirFunds?retryWrites=true&w=majority";

let varname="";

mongoose.connect(MongoDB_URL)
    .then((result)=> {
        console.log("Database Connected");
        app.listen(5000);
    })
    .catch((err)=> console.log(err));


//express app 
const app=express();

//listen req
app.listen(3000);

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static('views'));
//app.use(morgan('tiny'));
app.use(session({
    secret:'secret-key',
    resave:false,
    saveUninitialized:false,
}));


app.get("/",(req,res)=>{
    if(req.session.userInfo)
        res.render('home.ejs',{userInfo:req.session.userInfo});
    else
        res.render('home.ejs',{userInfo:"User"});
});

app.get("/contact",(req,res)=>{
    if(req.session.userInfo)
        res.render('contact-us.ejs',{userInfo:req.session.userInfo});
    else
        res.render('contact-us.ejs',{userInfo:"User"});

});

app.get("/login",(req,res)=>{
    res.render('index.ejs');
});

app.post("/register",async(req,res)=>{
    try{
        const uname=req.body.uname;
        const email=req.body.email;
        const organization=req.body.organization;
        const password=req.body.password;
        console.log(`uname:${uname} email:${email} organization:${organization} password: ${password}`);
        const newUser= new User({
            name:uname,
            email:email,
            organizationName:organization,
            password:password
        });

        const registered=await newUser.save();
        res.render('index.ejs');
    }
    catch(err){
        console.log(err);
    }    

});

app.post("/login",async(req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
        const userinfo= await User.findOne({email:email});

        if(userinfo.password===password){
            req.session.userInfo=userinfo;  
            console.log(req.session.userInfo);
            res.redirect("/");
        }
        else{
            res.send("Invalid Login");
        }
    }
    catch(err){
        console.log(err);
    }    
});

app.get("/fundRaiser",(req,res)=>{
    if(req.session.userInfo)
    {    
        category.find()
        .then((result)=>{
            res.render('fundraiser.ejs',{category:result,userInfo:req.session.userInfo});
        });
    }
    else
        res.redirect("/login");

});

app.post("/fundraiser",(req,res)=>{
    const fundraiser=new FundRaiser({
        userid:req.session.userInfo._id,
        catid:req.body.cat,
        proj_title:req.body.title,
        proj_desc:req.body.desc,
        upi_id:req.body.upi,
        target_amt:req.body.target_amt,
        end_date: new Date(req.body.enddate),
    });
    fundraiser.save();
    res.redirect("/");
});

app.get("/donate",(req,res)=>{
    fundraiser.find()
    .then((result)=>{
        category.find()
        .then((result1)=>{
           if(req.session.userInfo){ 
                res.render('donate.ejs',{
                    userInfo:req.session.userInfo,
                    fundRaiserinfo:result,
                    category:result1
                });
            }else
                res.render('donate.ejs',{
                    userInfo:"User",
                    fundRaiserinfo:result,
                    category:result1
                });        
        });
    });
    
});

app.get("/donate/:id",(req,res)=>{
    
    console.log(req.params.id);
    if(req.session.userInfo)
        res.render('donate-details.ejs',{userInfo:req.session.userInfo});
    else
        res.render('donate-details.ejs',{userInfo:"User"});
});

app.get("/logout",(req,res)=>{
   req.session.destroy((err)=>{
       if(err) throw err;
       res.redirect("/");
   }); 
});