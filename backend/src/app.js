const express = require("express");
const {adminAuth, userAuth} = require("./middlewares/auth");
const app = express();

// this is also valid and result will be same.
// app.use("/route", [rh, rh2], rh3, rh4);

// app.use(
//     "/user", 
//     [(req, res, next) => {
//         console.log("Handling the route user!!");
//         // res.send("Response!!");
//         next();
//         // res.send("Response!!");
//     }, 
//     (req, res, next) => {
//         console.log("Handling the route user 2!!");
//         // res.send("2nd Response!!");
//         next();
//     }, 
//     (req, res, next) => {
//         console.log("Handling the route user 3!!");
//         // res.send("3rd Response!!");
//         next();
//     }, 
//     (req, res, next) => {
//         console.log("Handling the route user 4!!");
//         // res.send("4th Response!!");
//         next();
//     }
//     ]
// );


// app.get("/user", (req, res, next) => {
//     console.log("Handling the route user 2!");
//     next();
//     // res.send("2nd route handler!");
// });
// app.get("/user", (req, res, next) => {
//     console.log("Handling the route user!");
//     next();
// });
// app.get("/user", (req, res, next) => {
//     console.log("Handling the route user 2!");
//     // next();
//     res.send("2nd route handler!");
// });


// there is a small difference between all and use function
// app.all("/admin", (req, res, next) => {});

// Handle Auth middleware for all requests GET, POST, DELETE, PUT
// app.use("/admin", (req, res, next) => {
//     const token = "xyz";
//     const isAdminAuthorized = token === "xyz";
//     if(isAdminAuthorized) {
//         next();
//     }
//     res.status(401).send("You are not an authorized user");
// });

app.use("/admin", adminAuth);

app.post("/user/login", (req, res) => {
    res.send("user logged in successfully")
});

app.get("/user", userAuth, (req, res) => {
    res.send("user data sent")
});

app.get("/admin/getAllData", (req, res) => {
    res.send("All data sent");
});

app.get("/admin/deleteUser", (req, res) => {
    res.send("Deleted a user");
});



const PORT = 8080;
app.listen(PORT, ()=> {
    console.log("server is successfully listening on http://localhost:", PORT);
});
