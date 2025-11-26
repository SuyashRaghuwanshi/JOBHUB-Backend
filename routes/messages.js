const router = require("express").Router();
const messageController = require("../controllers/messageController");
const {verifyAndAuthorization, verifyToken, verifyAndAdmin}= require("../middleware/verifyToken");


// Send Messages
router.post("/",verifyAndAuthorization, messageController.sendMessage);

// GET Messages
router.get("/:id",verifyAndAuthorization, messageController.getAllMessage);

module.exports = router