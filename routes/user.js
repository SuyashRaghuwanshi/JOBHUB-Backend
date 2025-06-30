const router = require("express").Router();
const userController = require("../controllers/userController");
const {verifyAndAuthorization, verifyToken, verifyAndAdmin}= require("../middleware/verifyToken");

// Update user
router.put("/:id",verifyAndAuthorization, userController.updateUser);

// Delete user
router.delete("/:id",verifyAndAuthorization, userController.deleteUser);

// Get user
router.get("/:id",verifyAndAuthorization, userController.getUser);

// Get user
router.get("/",verifyAndAdmin, userController.getAllUsers);


module.exports = router