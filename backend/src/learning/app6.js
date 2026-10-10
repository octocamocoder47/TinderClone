const express = require("express"); 
const {connectDB} = require("../config/database");
const app = express();
const {userModel: User} = require("../models/users");
const {validateSignUpData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("../middlewares/auth");

const JWT_SECRET = "fnirqo9wia9";

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    try {
        // validation of data
        validateSignUpData(req);
        const {firstName, lastName, emailId, password} = req.body;
        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);
        // creating a new instance of a user model
        // const user = new User(req.body);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });
        await user.save();
        res.send("User added successfully!");
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});


// app.post("/signup", async (req, res) => {
//     // const userObj = {
//     //     firstName: "Pransh",
//     //     lastName: "Gupta",
//     //     emailId: "abcd@gmail.com",
//     //     password: "pransh@123"
//     // };
//     // const userObj = {
//     //     firstName: "Viral",
//     //     lastName: "Kohli",
//     //     emailId: "virat@gmail.com",
//     //     password: "virat@123"
//     // };
    
//     // creating a new instance of a user model
//     const user = new User(req.body);

//     try {
//         await user.save();
//         res.send("User added successfully!");
//     } catch (err) {
//         res.status(400).send("Error saving the user: " + err.message);
//     }
// });

app.post("/login", async (req, res) => {
    try {
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user) {
            throw new Error("Invalid credentials")
        }
        const passwordHash = user.password;
        // const isPasswordValid = await bcrypt.compare(password, passwordHash);
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid) {
            // create a jwt token
            // token will expire immediately with 0d
            // const token = await jwt.sign({_id: user._id}, JWT_SECRET, {expiresIn: "0d"});
            // const token = await jwt.sign({_id: user._id}, JWT_SECRET, {expiresIn: "7d"});
            const token = await user.getJWT();
            // console.log(token);
            // Add a token to a cookie and send back to user
            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000), httpOnly: true});
            res.send("Login Successfull!");
        } else {
            throw new Error("Invalid credentials")
        }
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});


// app.use(userAuth());

app.get("/profile", userAuth, async (req, res) => {
    try {
        // const cookies = req.cookies;
        // const {token} = cookies;
        // if(!token) {
        //     throw new Error("Invalid Token")
        // }
        // // validate token
        // const decodedMessage = jwt.verify(token, JWT_SECRET);
        // const {_id} = decodedMessage;
        // const user = await User.findById(_id);
        // if(!user) {
        //     throw new Error("User doesn't exist");
        // }

        // // const isTokenValid = 
        // console.log(cookies);
        res.send(req.user);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    console.log("sending a connection request.");
    res.send(req.user.firstName + "sent connection request.");
});

// get user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try{
        const user = await User.findOne({ emailId: userEmail});
        // const user = await User.find({ emailId: userEmail});
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
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch(err) {
        res.status(400).send("Something went wrong");
    }
});


// findOneAndDelete is used to delete fields by using custom filter.
app.delete("/user", async (req, res) => {
    const userID = req.body.userID;
    const emailId = req.body.emailId;
    try {
        // const user = await User.findByIdAndDelete({ _id: userID });
        // const user = await User.findByIdAndDelete(userID);
        const user = await User.findOneAndDelete({emailId: emailId});
        res.send("User deleted successfully.");
    } catch(err) {
        res.status(400).send("Something went wrong");
    }
});


// findOneAndUpdate is used to update fields by using custom filter. in this function upsert option is used to insert if it doesn't exists. const options = { new: true, upsert: true, runValidators: true }
// app.patch("/user", async (req, res) => {
//     const userData = req.body;
//     const options = {
//         returnDocument: "before",
//         // returnDocument: "after"
//         runValidators: true,
//     }
//     const ALLOWED_UPDATES = ["userID", "photoUrl", "about", "gender", "age", "skills"];
//     try {
//         const isUpdateAllowed = Object.keys(userData).every(k => 
//             ALLOWED_UPDATES.includes(k)
//         );
//         if(!isUpdateAllowed) {
//             throw new Error("Update not allowed for some fields");
//         }
//         // const user = await User.findByIdAndUpdate({_id: userData.userID }, userData, options);
//         const user = await User.findOneAndUpdate({emailId: userData.emailId }, userData, options);
//         res.send("User updated successfully");
//     } catch(err) {
//         res.status(400).send("Update failed: " + err.message);
//     }
// });

app.patch("/user/:userID", async (req, res) => {
    const userID = req.params?.userID;
    const userData = req.body;
    const options = {
        returnDocument: "before",
        runValidators: true,
    }
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    try {
        const isUpdateAllowed = Object.keys(userData).every(k => 
            ALLOWED_UPDATES.includes(k)
        );
        if(!isUpdateAllowed) {
            throw new Error("Update not allowed for some fields");
        }
        if(data?.skills.length > 6) {
            throw new Error("Only 6 skills are allowed");
        }
        const user = await User.findByIdAndUpdate({_id: userID }, userData, options);
        res.send("User updated successfully");
    } catch(err) {
        res.status(400).send("Update failed: " + err.message);
    }
});

connectDB().then(() => {
    console.log("Database connected successfully.");
    const PORT = 8080;
    app.listen(PORT, ()=> {
        console.log("server is successfully listening on http://localhost:", PORT);
    });
}).catch(err => {
    console.error("Database can not be connected:", err.message);
});

// const PORT = 8080;
// app.listen(PORT, ()=> {
//     console.log("server is successfully listening on http://localhost:", PORT);
// });

