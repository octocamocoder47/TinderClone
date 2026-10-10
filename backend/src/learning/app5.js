const express = require("express"); 
const app = express();

// this will be called if there is an error we can keep it on voth places start and end
app.use("/", (err, req, res, next) => {
    if(err) {
        // Log your error
        res.status(500).send("something went wrong");
    }
});

// app.get("/getUserData", (req, res) => {
//     try {
//         // Logic of db call and get userdata
//         throw new Error("bhvgbgcfb");
//         res.send("user data sent")
//     } catch (err) {
//         res.status(500).send("something went wrong");
//         // err.message
//     }
// });

app.get("/getUserData", (req, res) => {
    // Logic of db call and get userdata
    throw new Error("bhvgbgcfb");
    res.send("user data sent")
});

// this is order when 4 params are passed in handler err is first param. less than 3 params we saw in previous examples.
app.use("/", (err, req, res, next) => {
    if(err) {
        // Log your error
        res.status(500).send("something went wrong");
    }
});

const PORT = 8080;
app.listen(PORT, ()=> {
    console.log("server is successfully listening on http://localhost:", PORT);
});
