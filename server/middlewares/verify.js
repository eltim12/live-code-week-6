const User = require('../models/user')
const Joke = require('../models/joke')
const jwt = require('jsonwebtoken')

module.exports = {

    authenticate: function (req, res, next) {
        console.log('authenticating...')
        try {
            const tokenCheck = jwt.verify(req.headers.access_token, process.env.SECRET_KEY)
            req.authenticated = tokenCheck
            console.log('user authenticated!')
            next()

        } catch (err) {
            res.status(401).json({
                msg: 'user not authenticated'
            })
        }
    },

    authorization: function (req, res, next) {
        User
            .findById(req.authenticated._id)
            .then(found => {
                console.log(found, 'dalem authorization=======')

                let authorized = false

                found.jokeList.map(e => {
                    if (e._id.toString() === req.params.id.toString()) {
                        authorized = true
                    }
                })

                if (authorized) {
                    next()
                } else {
                    res.status(401).json({
                        msg: 'not allowed!'
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    },
}