const express = require("express");
const userRouter = express.Router();


const User = require("../models/users");
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "age", "about", "gender", "skills"]
const LimitCount = 20

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
userRouter.get("/user/all", async (req, res) => {
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

// userRouter.get("/user/feed", userAuth, async (req, res) => {
//     try {
//         const loggedInUserId = req.user._id;
//         const feed = await User.aggregate([
//             // 1. Exclude the logged-in user
//             { 
//                 $match: { 
//                 _id: { $ne: loggedInUserId } 
//                 } 
//             },

//             // 2. Lookup existing connection requests between the two users
//             {
//                 $lookup: {
//                 from: "ConnectionRequest", // Must match the actual MongoDB collection name (usually lowercase & plural)
//                 let: { targetUserId: "$_id" },
//                 pipeline: [
//                     {
//                     $match: {
//                         $expr: {
//                         $or: [
//                             { $and: [{ $eq: ["$fromUserId", "$$targetUserId"] }, { $eq: ["$toUserId", loggedInUserId] }] },
//                             { $and: [{ $eq: ["$fromUserId", loggedInUserId] }, { $eq: ["$toUserId", "$$targetUserId"] }] }
//                         ]
//                         }
//                     }
//                     }
//                 ],
//                 as: "connectionInfo"
//                 }
//             },

//             // 3. Keep only users with NO prior connection request (empty array)
//             {
//                 $match: {
//                 connectionInfo: { $size: 0 }
//                 }
//             },

//             // 4. Randomize profiles for a feed experience (or use { $limit: LimitCount } for deterministic results)
//             { $sample: { size: LimitCount } },

//             // 5. Remove temporary and sensitive fields from output
//             {
//                 $project: {
//                 connectionInfo: 0,
//                 password: 0,
//                 __v: 0
//                 }
//             }
//         ]);

//     } catch(err) {
//         res.status(400).json({message: err.message});
//     }
// });

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        // we have to construct query for below conditions.
        // we have to find users how are present in users table but not connectionsRequests table where loggedinUser is paired with them in any way.
        // user should see all users except
        // 0. his own profile
        // 1. accepted profiles
        // 2. rejected profiles
        // 3. interested profiles
        
        // find all connection requests (sent + received)
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUserId},
                { toUserId: loggedInUserId},
            ],
        })
        .select(["fromUserId", "toUserId"])
        // .populate("fromUserId", ["firstName", "lastName"])
        // .populate("toUserId", ["firstName", "lastName"])
        ;

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(request => {
            hideUsersFromFeed.add(request.fromUserId.toString());
            hideUsersFromFeed.add(request.toUserId.toString());
        });

        const userFeed = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) }, },
                { _id: { $ne: loggedInUserId, } },
            ]
        })
        .select(USER_SAFE_DATA)
        ;

        res.send(userFeed);
    } catch(err) {
        res.status(400).json({message: err.message});
    }
});


module.exports = userRouter;
