const express = require("express");
const userRouter = express.Router();


const User = require("../models/users");


// get user by email
userRouter.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try{
        const user = await User.findOne({ emailId: userEmail});
        if(!user) {
            res.status(404).send("User not Found.");
        } else {
            res.send(user);
        }
    } catch (err) {
        res.status(400).send("Something went wrong.");
    };
});

// Feed API - GET /feed - get all the users from the database
userRouter.get("/user/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch(err) {
        res.status(400).send("Something went wrong");
    }
});


userRouter.delete("/user/:userID", async (req, res) => {
    const userID = req.params?.userID;
    // const emailId = req.body.emailId;
    try {
        const user = await User.findByIdAndDelete({_id: userID });
        // const user = await User.findOneAndDelete({emailId: emailId});
        res.send("User deleted successfully.");
    } catch(err) {
        res.status(400).send("Something went wrong");
    }
});


// findOneAndDelete is used to delete fields by using custom filter.
userRouter.delete("/user", async (req, res) => {
    const emailId = req.body.emailId;
    try {
        const user = await User.findOneAndDelete({emailId: emailId});
        res.send("User deleted successfully.");
    } catch(err) {
        res.status(400).send("Something went wrong");
    }
});


module.exports = userRouter;
