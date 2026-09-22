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

// 38.22