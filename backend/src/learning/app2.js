const express = require("express");
const app = express();

// this will send same response doesn't matter the route
/* app.use((req, res) => {
    res.send("Hello from the server!")
}) */

// This will only handle GET call to /user
app.get("/user", (req, res) => {
    res.send({ "firstname": "Pransh", "lastname": "Gupta" })
});

app.post("/user", async (req, res) => {
    console.log(req.body);
    res.send("Data Successfully saved to database");
});

app.delete("/user", (req, res) => {
    res.send("Deleted Successfully");
});

// This will match all the HTTP nethod API calls to /test
app.use("/test", (req, res) => {
    res.send("Hello from the server /test!")
})

/* 
app.use("/", (req, res) => {
    res.send("Hello from the server /!")
}) */


const PORT = 8080;
app.listen(PORT, ()=> {
    console.log("server is successfully listening on http://localhost:", PORT);
});
