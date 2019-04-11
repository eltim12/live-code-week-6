const jwt = require('jsonwebtoken')

function sign(payload, secret) {
    let token = jwt.sign(payload, secret)
    return token
}

module.exports = sign
