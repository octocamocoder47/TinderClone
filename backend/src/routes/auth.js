const express = require("express");
const authRouter = express.Router();


const User = require("../models/users");
const {validateSignUpData} = require("../utils/validation");
const {getEncryptedPassword, clearCookies} = require("../utils/utils");


authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);
        const {firstName, lastName, emailId, password} = req.body;
        const passwordHash = await getEncryptedPassword(password);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });
        await user.save();
        res.send("User added successfully!");
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user) {
            throw new Error("Invalid credentials")
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000), httpOnly: true});
            res.send("Login Successfull!");
        } else {
            throw new Error("Invalid credentials")
        }
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    // res.cookie("token", null, {
    //     expires: new Date(Date.now()),
    // });
    clearCookies(res);
    res.send("Logout successfull");
});


module.exports = authRouter;
