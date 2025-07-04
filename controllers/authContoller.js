const User=require("../models/User");
const CryptoJS = require("crypto-js");
const jwt= require('jsonwebtoken')
module.exports = {
    // createUser: async (req, res) => {
    //     const newUser=new User({
    //         username: req.body.username,
    //         email: req.body.email,
    //         password:CryptoJS.AES.encrypt(req.body.password, process.env.SECRET).toString(),
    //     });
    //     try{
    //         const savedUser=await newUser.save();
    //         res.status(201).json(savedUser);
    //     }catch(err){
    //         res.status(500).json(err);
    //     }
    // },
    createUser: async (req, res) => {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.SECRET
            ).toString(),
        });
        try {
            const savedUser = await newUser.save();
            const { password, __v, createdAt, ...others } = savedUser._doc;
            res.status(201).json(others); // Optional: remove password from response
        } catch (err) {
            res.status(500).json({ error: "Failed to create user", details: err.message });
        }
        },
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email });
            if(!user) return res.status(404).json("Wrong Login Details");
            const decryptedpass=CryptoJS.AES.decrypt(user.password, process.env.SECRET);
            const depassword=decryptedpass.toString(CryptoJS.enc.Utf8);
            if (depassword !== req.body.password) {
                return res.status(401).json("Wrong Password");
                }
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SEC,
                {expiresIn:"2d"}
                );
            const {password, __v,createdAt, ...others}=user._doc;
            res.status(200).json({...others, token});
        } catch (err) {
            res.status(500).json(err);
        }
    }
};