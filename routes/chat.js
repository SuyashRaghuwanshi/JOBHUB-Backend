const router = require("express").Router();
const chatController = require("../controllers/chatController");
const {verifyAndAuthorization, verifyToken}= require("../middleware/verifyToken");


// Create Chats
router.post("/",verifyAndAuthorization, chatController.accessChat);

// GET CHats
router.get("/",verifyAndAuthorization, chatController.getChat);

module.exports = router