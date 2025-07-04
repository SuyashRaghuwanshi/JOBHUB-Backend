const User = require("../models/User");
const CryptoJS = require("crypto-js");

module.exports = {
  // updateUser: async (req, res) => {
  //   if (req.body.password) {
  //     req.body.password = CryptoJS.AES.encrypt(
  //       req.body.password,
  //       process.env.JWT_SEC
  //     ).toString();
  //   }
  //   try {
  //     const UpdatedUser = await User.findByIdAndUpdate(
  //       req.user.id,
  //       {
          // $set: req.body,
  //       },
  //       { new: true }
  //     );
  //     const { password, __v, createdAt, ...others } = UpdatedUser._doc;
  //     res.status(200).json({ ...others}); // No spread here
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // },
  updateUser: async (req, res) => {
  console.log("🚀 Reached updateUser controller");
  console.log("Phone receiveed", req.body.phone);
  if (req.body.profile) {
    delete req.body.profile;
  }

  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.JWT_SEC
    ).toString();
  }

  const updateData={ $set: req.body };
  updateData.$unset={profile:""};
  try {
    const UpdatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    );

    if (!UpdatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, __v,profile, createdAt, ...others } = UpdatedUser._doc;
    console.log("✅ Updated user:", others);
    res.status(200).json(others);

  } catch (err) {
    console.error("❌ Error updating user:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
},

  deleteUser: async(req, res)=>{
    try{
      await User.findByIdAndDelete(req.user.id)
      res.status(200).json("Account successfully Deleted")
    }catch(err){
      res.status(500).json(err)
    }
  },

  getUser: async(req, res)=>{
    try{
      const user=await User.findById(req.user.id);
      const {password, __v, createdAt,profile, updateUser, ...userData}=user._doc;
      res.status(200).json(userData)
    }catch(err){
      res.status(500).json(err)
    }
  },

  getAllUsers: async (req, res)=>{
    try{
      const allUsers = await User.find();
      const safeUsers = allUsers.map(user => {
      const { password, __v, createdAt, profile, ...userData } = user._doc;
      return userData;
    });
    res.status(200).json(safeUsers);
    }catch(err){
      res.status(500).json(err)
    }
  }
};
