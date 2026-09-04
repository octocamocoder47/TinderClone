const express = require("express");
const app = express();

// this is also valid and result will be same.
// app.use("/route", [rh, rh2], rh3, rh4);

app.use(
    "/user", 
    [(req, res, next) => {
        console.log("Handling the route user!!");
        // res.send("Response!!");
        next();
        // res.send("Response!!");
    }, 
    (req, res, next) => {
        console.log("Handling the route user 2!!");
        // res.send("2nd Response!!");
        next();
    }, 
    (req, res, next) => {
        console.log("Handling the route user 3!!");
        // res.send("3rd Response!!");
        next();
    }, 
    (req, res, next) => {
        console.log("Handling the route user 4!!");
        // res.send("4th Response!!");
        next();
    }
    ]
);

const PORT = 8080;
app.listen(PORT, ()=> {
    console.log("server is successfully listening on http://localhost:", PORT);
});
