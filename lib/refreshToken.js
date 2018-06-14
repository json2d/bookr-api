const mung = require('express-mung');
const jwt = require('jsonwebtoken');

function refresh(body, req, res) {
    const expiresIn = Number(process.env.JWT_EXPIRE_IN_SECS)
    body.token = jwt.sign({id:req.user._id}, process.env.JWT_SECRET, {expiresIn});

    return body;
}

module.exports = mung.json(refresh);
