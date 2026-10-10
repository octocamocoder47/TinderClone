const express = require("express");
const profileRouter = express.Router();


// const User = require("../models/users");
const {userAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");
const {getEncryptedPassword, clearCookies} = require("../utils/utils");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

// profileRouter.patch("/profile/edit/:userID", async (req, res) => {
//     const userID = req.params?.userID;
//     const userData = req.body;
//     const options = {
//         returnDocument: "before",
//         runValidators: true,
//     }
//     const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
//     try {
//         const isUpdateAllowed = Object.keys(userData).every(k => 
//             ALLOWED_UPDATES.includes(k)
//         );
//         if(!isUpdateAllowed) {
//             throw new Error("Update not allowed for some fields");
//         }
//         if(data?.skills.length > 6) {
//             throw new Error("Only 6 skills are allowed");
//         }
//         const user = await User.findByIdAndUpdate({_id: userID }, userData, options);
//         res.send("User updated successfully");
//     } catch(err) {
//         res.status(400).send("Update failed: " + err.message);
//     }
// });

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if(!validateEditProfileData(req)) {
            throw new Error("Invalid edit request");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
        await loggedInUser.save();
        // res.send(`${loggedInUser.firstName} your profile is updated successfully`);
        res.json({
            message: `${loggedInUser.firstName} your profile is updated successfully`, 
            data: loggedInUser
        });
    } catch(err) {
        res.status(400).send("Update failed: " + err.message);
    }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const {oldPassword, newPassword} = req.body;
        if(!await user.validatePassword(oldPassword)) {
            throw new Error("Invalid password");
        }
        user.password = await getEncryptedPassword(newPassword);
        user.save();
        clearCookies(res);
        res.send("Password updated successfully");
    } catch(err) {
        res.status(400).send("Update failed: " + err.message);
    }
});

module.exports = profileRouter;
