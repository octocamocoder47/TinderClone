
const bcrypt = require("bcrypt");

const getEncryptedPassword = async function (password) {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
};

const clearCookies = function (res) {
    // res.cookie("token", null, {
    //     expires: new Date(Date.now()),
    // });
    res.clearCookie("token");
}

module.exports = {
    getEncryptedPassword,
    clearCookies,
};
