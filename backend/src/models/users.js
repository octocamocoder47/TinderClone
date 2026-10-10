const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
        minLength: 4,
        maxLength: 15,
        trim: true,
    },
    lastName: {
        type: String,
        minLength: 4,
        maxLength: 15,
        trim: true,
    },
    emailId: {
        type : String,
        lowercase: true,
        require: true,
        unique: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email address: " + value)
            }
        },
    },
    password: {
        type: String,
        require: true,
        minLength: 8,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong password");
            }
        },
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
        },
    },
    photoUrl: {
        type: String,
        default: "https://www.magnific.com/free-photos-vectors/default-user",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("Invalid Photo URL: " + value);
            }
        },
    },
    about: {
        type: String,
        default: "This is a default about of user!",
        maxLength: 150,
    },
    skills: {
        type: [String],
        default: [],
        validate(value) {
            const l = value.length
            if(l>6) {
                throw new Error("Only 6 skills are allowed");
            }
        },
    },
}, {
    timestamps: true,
});

const JWT_SECRET = "fnirqo9wia9";

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({_id: user._id}, JWT_SECRET, {expiresIn: "7d"});
    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
}

const userModel = mongoose.model("User", userSchema);

module.exports = {userModel};
