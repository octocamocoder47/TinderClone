const express = require("express"); 
const {connectDB} = require("./config/database");
const app = express();
const {userModel: User} = require("./models/users");

app.use(express.json());

app.post("/signup", async (req, res) => {
    // const userObj = {
    //     firstName: "Pransh",
    //     lastName: "Gupta",
    //     emailId: "abcd@gmail.com",
    //     password: "pransh@123"
    // };
    // const userObj = {
    //     firstName: "Viral",
    //     lastName: "Kohli",
    //     emailId: "virat@gmail.com",
    //     password: "virat@123"
    // };
    
    // creating a new instance of a user model
    const user = new User(req.body);

    try {
        await user.save();
        res.send("User added successfully!");
    } catch (err) {
        res.status(400).send("Error saving the user: " + err.message);
    }
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

