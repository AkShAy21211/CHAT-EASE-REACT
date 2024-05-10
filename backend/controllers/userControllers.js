const userModel = require("../models/userModel");
const generateToken = require("../helpers/generateToken")
const asyncHandler = require("express-async-handler");


const userRegister = asyncHandler(async (req, res) => {
  const { name, email, password, picture } = req.body;

  if (!name || !email || !password) {
    res.status(400)
    throw new Error("Please enter all the feilds");
  }

  const existingUser = await userModel.findOne({email:email});

  if(existingUser){
    res.status(400)
    throw new Error("User already exists please login")
  }


  const newUser = await userModel.create({
    name,
    email,
    password,
    picture
  });

  if(newUser){

    res.status(201).json({
        _id:newUser._id,
        name:newUser.name,
        email:newUser.email,
        picture:newUser.picture,
        token:generateToken(newUser._id)
    })
  }else{

    res.status(400);
    throw new Error("Failed to create user")
  }

});

const userLogin = asyncHandler(async (req, res) => {

    const {email,password} = req.body;

    if(!email || !password){

        res.status(400)
        throw new Error("Please enter all the feilds")
    }

    const user  = await userModel.findOne({email:email});

    if(user && (await user.matchPassword(password))){

        res.status(200).json({
        _id:user._id,
        name:user.name,
        email:user.email,
        picture:user.picture,
        token:generateToken(user._id)
        })
    }
});





const getAllUsers = asyncHandler(async(req,res)=>{

  console.log('called from getalll');
  const keyword = req.query.search?{

    $or:[
      {
        name:{$regex:req.query.search,$options:"i"},
        email:{$regex:req.query.search,$options:"i"}
      }
    ]
  }:{}


  const users = await userModel.find(keyword).find({_id:{$ne:req.user._id}})
  res.send(users)
})

module.exports = {
  userLogin,
  userRegister,
  getAllUsers,
};
