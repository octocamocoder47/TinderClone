const express = require("express"); 
const {connectDB} = require("./config/database");
const app = express();
const {User} = require("./models/users");

app.post("/signup", async (req, res) => {
    // const userObj = {
    //     "firstName": "Pransh",
    //     "lastName": "Gupta",
    //     "emailId": "abcd@gmail.com",
    //     "password": "pransh@123"
    // };
    const userObj = {
        "firstName": "Viral",
        "lastName": "Kohli",
        "emailId": "virat@gmail.com",
        "password": "virat@123"
    };
    
    // creating a new instance of a user model
    const user = new User(userObj);

    try {
        await user.save();
        res.send("User added successfully!");
    } catch (err) {
        res.status(400).send("Error saving the user: " + err.message);
    }
});

app.get("/users", async (req, res) => {
    const user = new User();
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
