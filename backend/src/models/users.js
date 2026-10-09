const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
        minLength: 4,
        maxLength: 12,
        trim: true,
    },
    lastName: {
        type: String,
        minLength: 4,
        maxLength: 12,
        trim: true,
    },
    emailId: {
        type : String,
        lowercase: true,
        require: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        require: true,
        minLength: 8,
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.magnific.com/free-photos-vectors/default-user",
    },
    about: {
        type: String,
        default: "This is a default about of user!",
        maxLength: 150,
    },
    skills: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
});

const userModel = mongoose.model("User", userSchema);

module.exports = {userModel};
