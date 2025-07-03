const User = require("../models/User");
const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    console.log(authHeader);
    if (authHeader) {
        const token=authHeader.split(" ")[1];
        console.log("Extracted token:", token);
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
        if (req.user.id) {
            next();
        } else {
            // In verifyAndAuthorization
res.status(403).json("verifyAndAuthorization: Not allowed");

        }
    });
};

//CHeck this out later as it is giving opposite answer
const verifyAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("verifyAndAdmin: Not allowed");
        }
    })
};

module.exports = {verifyToken,verifyAndAuthorization, verifyAndAdmin};
