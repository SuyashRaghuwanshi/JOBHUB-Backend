const router = require("express").Router();
const bookmarkController = require("../controllers/bookmarkController");


// CREATE BOOKMARKS
router.post("/", bookmarkController.createBookMark);


// DELETE BOOKMARKS

router.delete("/:id", bookmarkController.deleteBookmark);


// GET BOOKMARKS
router.get("/:userId", bookmarkController.getBookmarks);



module.exports = router