const express = require("express");
const userRouter = express.Router();


const User = require("../models/users");
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "age", "about", "gender", "skills"]

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


userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        // Not good way because populate will send all data from user table including sensitive data.
        // const userRequests = await ConnectionRequest.find({toUserId: loggedInUserId, status: "interested"}).populate("fromUserId");
        const userRequests = await ConnectionRequest.find({
            toUserId: loggedInUserId, status: "interested"
        })
        // .populate("fromUserId", "firstName lastName photoUrl");
        .populate("fromUserId", USER_SAFE_DATA);
        res.json(userRequests);
    } catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const userRequests = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUserId, status: "accepted"},
                {fromUserId: loggedInUserId, status: "accepted"},
            ],
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        const data = userRequests.map((row) => {
            // if(row.fromUserId._id.equals(loggedInUserId)) {
            //     return row.toUserId;
            // }
            if(row.fromUserId._id.toString() === loggedInUserId.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json(data);
    } catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
});


module.exports = userRouter;
