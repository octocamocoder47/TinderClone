
const validator = require("validator");

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName) {
        throw new Error("Name is not valid!");
    }
    // else if(firstName.length < 4 || firstName.length > 15) {
    //     throw new Error("FirstName should be 4 to 15 characters")
    // }

    if(!validator.isEmail(emailId)) {
        throw new Error("Provide valid email id");
    }
    if(!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password!")
    }
};

module.exports = {
    validateSignUpData,
};
