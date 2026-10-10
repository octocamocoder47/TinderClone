const express = require("express");
const requestRouter = express.Router();

const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/users");
const {userAuth} = require("../middlewares/auth");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params?.toUserId;
        const status = req.params?.status;
        const documentData = {
            fromUserId, toUserId, status,
        };

        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status)) {
            throw new Error("invalid status type: " + status);
        }

        const toUser = User.findById(toUserId);
        if(!toUser) {
            throw new Error("User not found")
        }

        // fromUserId === toUserId  // this will not work because it is a mongoose object id
        // if(fromUserId.equals(toUserId)) {
        //     throw new Error("can't send request to yourself");
        // }

        // check if there is an existing request alredy present
        // const reqAtoB = ConnectionRequest.findOne({fromUserId: fromUserId, toUserId: toUserId});
        // const reqBtoA = ConnectionRequest.findOne({fromUserId: toUserId, toUserId: fromUserId});
        // if(reqAtoB || reqBtoA) {
        //     throw new Error("Request already exists.");
        // }
        const existingConnectionRequest = ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId},
            ],
        });
        if(existingConnectionRequest) {
            // throw new Error("Request already exists.");
            return res.status(404).send({message: "Request already exists"})
        }

        const connectionRequest = new ConnectionRequest(documentData);

        const data = await connectionRequest.save();
        res.json({
            // message: "Connection request sent successfully",
            message: req.user.firstName + " is " + status + " in " + toUser.firstName,
            data,
        });
        // res.send(req.user.firstName + "sent connection request.");
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = requestRouter;
