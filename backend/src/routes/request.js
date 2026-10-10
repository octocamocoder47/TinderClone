const express = require("express");
const requestRouter = express.Router();

const {userAuth} = require("../middlewares/auth");

requestRouter.post("/request/send/interested/:userID", userAuth, async (req, res) => {
    res.send(req.user.firstName + "sent connection request.");
});

module.exports = requestRouter;
