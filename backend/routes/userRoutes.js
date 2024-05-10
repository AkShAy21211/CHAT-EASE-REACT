const express  = require("express");
const userRoute = express.Router();
const  {protect} = require("../middleware/authMiddleware")
const { userRegister, userLogin,getAllUsers } = require("../controllers/userControllers");


userRoute.post('/login',userLogin)
userRoute.post('/register',userRegister)
userRoute.get('/',protect,getAllUsers)

module.exports = userRoute