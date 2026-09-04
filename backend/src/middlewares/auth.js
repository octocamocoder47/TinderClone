
const adminAuth = (req, res, next) => {
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if(isAdminAuthorized) {
        next();
    }
    res.status(401).send("You are not an authorized user");
};

const userAuth = (req, res, next) => {
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if(isAdminAuthorized) {
        next();
    }
    res.status(401).send("You are not an authorized user");
};

module.exports = {adminAuth, userAuth};
