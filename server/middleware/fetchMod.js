const jwt = require('jsonwebtoken');

const Secret_Key = process.env.SECRET_KEY

const fetchMod = (req, res, next) => {
    const token = req.header('mod-token');
    if (!token) {
        res.status(401).json({ success: false, error: "Unauthorized" });
    }
    try {
        const data = jwt.verify(token, Secret_Key);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, error: "Invalid token" });
    }
}
module.exports = fetchMod;