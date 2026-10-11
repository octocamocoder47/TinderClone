const express = require("express");
const requestRouter = express.Router();

const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/users");
const {userAuth} = require("../middlewares/auth");

requestRouter.get("/request", async (req, res) => {
    try {
        const data = await ConnectionRequest.find({});
        res.json(data);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

requestRouter.patch("/request/edit/:requestId", async (req, res) => {
    try {
        const requestId = req.params?.requestId;
        const existingRequest = await ConnectionRequest.findById(requestId);
        Object.keys(req.body).forEach(key => existingRequest[key] = req.body[key]);
        const data = await existingRequest.save()
        res.json(data);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

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
        const existingConnectionRequest = await ConnectionRequest.findOne({
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

        const data = await connectionRequest.save({ runApiLogic: true });
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

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const {status, requestId} = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)) {
            throw new Error("invalid status type: " + status);
        }
        
        const existingConnectionRequest = await ConnectionRequest.findOne({_id: requestId, toUserId: loggedInUserId, status: "interested"});
        if(!existingConnectionRequest) {
            throw new Error("Connection request not found");
        }

        existingConnectionRequest.status = status;
        const data = await existingConnectionRequest.save({ runApiLogic: false });
        res.json({
            message: "Connection request " + status,
            data,
        });
    } catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = requestRouter;
