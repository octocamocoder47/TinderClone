const express = require("express");
const profileRouter = express.Router();


const {userModel: User} = require("../models/users");
const {userAuth} = require("../middlewares/auth");

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

profileRouter.patch("/profile/edit/:userID", async (req, res) => {
    const userID = req.params?.userID;
    const userData = req.body;
    const options = {
        returnDocument: "before",
        runValidators: true,
    }
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    try {
        const isUpdateAllowed = Object.keys(userData).every(k => 
            ALLOWED_UPDATES.includes(k)
        );
        if(!isUpdateAllowed) {
            throw new Error("Update not allowed for some fields");
        }
        if(data?.skills.length > 6) {
            throw new Error("Only 6 skills are allowed");
        }
        const user = await User.findByIdAndUpdate({_id: userID }, userData, options);
        res.send("User updated successfully");
    } catch(err) {
        res.status(400).send("Update failed: " + err.message);
    }
});

module.exports = profileRouter;
