const User = require("../models/User");
const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    console.log(authHeader);
    if (authHeader) {
        const token=authHeader.split(" ")[1];
        console.log("Token:",token);
        jwt.verify(token, process.env.JWT_SEC, async (err, user) => {
            if(err) {
                console.log("JWT_SECRET used for verify:", process.env.JWT_SEC);
                return res.status(403).json("Token is not valid!");
            }
            req.user = user;
                console.log("User verified:", user);
                next();
        });
    }else{
        return res.status(401).json("You are not authenticated!");
    }
};
const verifyAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id) {
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    })
};
//CHeck this out later as it is giving opposite answer
const verifyAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.params.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    })
};

module.exports = {verifyToken,verifyAndAuthorization, verifyAndAdmin};
