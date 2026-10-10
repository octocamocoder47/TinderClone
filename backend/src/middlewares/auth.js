
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const JWT_SECRET = "fnirqo9wia9";

// const adminAuth = (req, res, next) => {
//     const token = "xyz";
//     const isAdminAuthorized = token === "xyz";
//     if(isAdminAuthorized) {
//         next();
//     }
//     res.status(401).send("You are not an authorized user");
// };

// const userAuth = (req, res, next) => {
//     const token = "xyz";
//     const isAdminAuthorized = token === "xyz";
//     if(isAdminAuthorized) {
//         next();
//     }
//     res.status(401).send("You are not an authorized user");
// };

const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) {
            throw new Error("Invalid Token")
        }
        const userId = await jwt.verify(token, JWT_SECRET);
        const user = await User.findById(userId);
        if(!user) {
            throw new Error("User doesn't exist");
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
}

// module.exports = {adminAuth, userAuth};
module.exports = { userAuth};
