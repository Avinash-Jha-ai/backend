const userModel =require("../models/user.model");
const bcrypt=require("bcryptjs");
const jwt =require("jsonwebtoken");
const blacklistModel=require("../models/blacklist.model");
const redis =require("../configs/cache")

async function registeruser(req,res){
    const {username ,email ,password }= req.body;

    const isalreadyregister=await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    })

    if(isalreadyregister){
        return res.status(400).json({
            message:"user is already exist "
        })
    }

    const hash =await bcrypt.hash(password,10);

    const user=await userModel.create({
        username ,
        email,
        password:hash
    })

    const token =jwt.sign({
        id :user._id,
        username :user.username
    },process.env.JWT_SECRET,{
        expiresIn:"3d",
    })

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    return res.status(201).json({
        message :"user registerd successfully",
        user:{
            id:user._id,
            username :user.username,
            email :user.email
        }
    })
}

async function loginuser(req,res){
    const {email ,username ,password} =req.body;

    if(!password){
        return res.status(400).json({
            message:"password is required"
        })
    }



    const user =await userModel.findOne({
        $or :[
            {email},
            {username}
        ]
    }).select("+password")

    if(!user){
        return res.status(400).json({
            message:"invalid credentials"
        })
    }

    const ispasswordvalid =await bcrypt.compare(password,user.password);

    if(!ispasswordvalid){
        return res.status(400).json({
            message:"invalid credentials"
        })
    }

    const token =jwt.sign({
        id :user._id,
        username :user.username,

    },process.env.JWT_SECRET,{
        expiresIn:"3d"
    })

    res.cookie("token" ,token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    return res.status(200).json({
        message:"user login successfully",
        user:{
            id :user._id,
            username:user.username,
            email :user.email
        }
    })
}

async function getMe(req,res){
    const user =await userModel.findById(req.user.id)
    res.status(200).json({
        message:"user fetch successfully",
        user
    })
}

async function logoutuser(req,res){
    const token = req.cookies?.token

    if(!token){
        return res.status(400).json({
            message:"Token not found"
        })
    }

    await redis.set(token, Date.now().toString(),"EX",60*60)

    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    res.status(200).json({
        message:"logout successfully"
    })
}
module.exports ={
    registeruser,
    loginuser,
    getMe,
    logoutuser
}