
const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // reference to the User collection
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is not supported`,
        },
    },
}, {
    timestamps: true,
});


connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

// commented this because we want to run this validation only when request is being created.
connectionRequestSchema.pre("save", async function (options) {
    if (!options || !options.runApiLogic) {
        return; // Simply return to skip validation and proceed to save
    }
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("can't send request to yourself");
    };
    return;
});

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequest;
