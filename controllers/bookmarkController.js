const Bookmark=require("../models/Bookmark")
module.exports = {
    createBookMark: async (req, res) => {
        const newBook=new Bookmark(req.body);
        try{
            await newBook.save();
            res.status(201).json("Bookmark Successfully Created")
        }catch(err){
            res.status(500).json(err);
        }
    },
    deleteBookmark: async (req, res) => {
        try{
            await Bookmark.findByIdAndDelete(req.params.id);
            res.status(201).json("Bookmark Successfully Deleted")
        }catch(err){
            res.status(500).json(err);
        }
    },
    getBookmarks: async (req, res) => {
        try{
            const bookmarks=await Bookmark.find({userId:req.params.userId});
            res.status(201).json(bookmarks)
        }catch(err){
            res.status(500).json(err);
        }
    },
}