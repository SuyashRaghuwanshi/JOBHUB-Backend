const User = require("../models/User");
const CryptoJS = require("crypto-js");

module.exports = {
  updateUser: async (req, res) => {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.JWT_SEC
      ).toString();
    }
    try {
      const UpdatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      const { password, __v, createdAt, ...others } = UpdatedUser._doc;
      res.status(200).json({ ...others}); // No spread here
    } catch (err) {
      res.status(500).json(err);
    }
  },

  deleteUser: async(req, res)=>{
    try{
      await User.findByIdAndDelete(req.params.id)
      res.status(200).json("Account successfully Deleted")
    }catch(err){
      res.status(500).json(err)
    }
  },

  getUser: async(req, res)=>{
    try{
      const user=await User.findById(req.params.id);
      const {password, __v, createdAt, updateUser, ...userData}=user._doc;
      res.status(200).json(userData)
    }catch(err){
      res.status(500).json(err)
    }
  },

  getAllUsers: async (req, res)=>{
    try{
      const allUsers=await User.find();
      res.status(200).json(allUsers)
    }catch(err){
      res.status(500).json(err)
    }
  }
};
