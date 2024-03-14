const jwt = require('jsonwebtoken');

const Secret_Key = process.env.SECRET_KEY

const fetchuser = (req, res, next) => {
    const success = false;
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).json({ success, error: "Authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, Secret_Key);
        // console.log(data);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).json({ success, error: "Authenticate using a valid token" });
    }
}
module.exports = fetchuser;