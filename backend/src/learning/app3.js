const express = require("express");
const app = express();

// To understand it read more about regular expressions.
// /ab?c, /a(bc)?d
// With ? this b became optional. it will work for /abc, /ac
// with brackets it will make characters inside it optional. /abcd, /ad, (/acd it will not work)
// /ab+c
// with + it will only check occurence of character behind it. it will work for /abc, /abbc, /abbbbbbbbc
// /ab*cd
// with * if you add anything inbetween it will work. it will work for /abcd, /abPransHcd
// we can pass regex also and it will work like below.
// /a/ , /.*fly$/
/* app.get(/.*fly$/, (req, res) => {
    res.send("Hello");
});

app.get("abc", (req, res) => {
    res.send("Hello");
}); */


// dynamic routes
// http://localhost:8080/user/101
// http://localhost:8080/user/101/Pransh/testing
app.get("/user/:userId:name:password", (req, res) => {
    console.log(req.params)
    res.send({ "firstname": "Pransh", "lastname": "Gupta" })
});


// query params
// http://localhost:8080/user?userId=101
// http://localhost:8080/user?userId=101&name=pransh
app.get("/user", (req, res) => {
    console.log(req.query)
    res.send({ "firstname": "Pransh", "lastname": "Gupta" })
});

const PORT = 8080;
app.listen(PORT, ()=> {
    console.log("server is successfully listening on http://localhost:", PORT);
});
