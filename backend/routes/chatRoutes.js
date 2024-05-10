const express  = require("express");
const { protect } = require("../middleware/authMiddleware");
const {accessChat, fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup}  = require("../controllers/chatController")
const chatRoute = express.Router();



chatRoute.post('/',protect,accessChat);
chatRoute.get('/',protect,fetchChats);
chatRoute.post('/group',protect,createGroupChat);
chatRoute.put('/rename',protect,renameGroup)
chatRoute.put('/removegroup',protect,removeFromGroup)
chatRoute.put('/groupadd',protect,addToGroup)


module.exports = chatRoute;