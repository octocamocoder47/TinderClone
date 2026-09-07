const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        process.env.MONGODB_URI ||
        "mongodb://root:example@host.containers.internal:27017/devdb?authSource=admin"
    );
};

module.exports = {connectDB};
