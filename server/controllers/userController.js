const User = require('../models/user')
const Joke = require('../models/joke')
const bcrypt = require('../helpers/bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {

    create(req, res) {
        User
            .create({
                email: req.body.email,
                password: req.body.password
            })
            .then(createdUser => {
                res.status(201).json(createdUser)
            })
            .catch(err => {
                if (err.errors.email) {
                    res.status(400).json({
                        msg: err.errors.email.message
                    })
                } else if (err.errors.password) {
                    res.status(400).json({
                        msg: err.errors.password.message
                    })
                } else {
                    res.status(500).json('internal server error')
                }
            })
    },

    findAll(req, res) {
        User
            .find({})
            .then(allUsers => {
                res.status(200).json(allUsers)
            })
            .catch(err => {
                res.status(500).json({
                    msg: err.message
                })
            })
    },

    verify(req, res) {
        try {
            const tokenCheck = jwt.verify(req.headers.access_token, process.env.SECRET_KEY)
            req.authenticated = tokenCheck
            res.status(200).json({
                msg: "user authenticated"
            })
        } catch (err) {
            res.status(401).json({
                msg: 'user not authenticated'
            })
        }
    },

    find(req, res) {
        User
            .findById(req.authenticated._id)
            .populate("jokeList")
            .then(foundUser => {
                if (foundUser) {
                    res.status(200).json(foundUser)
                } else {
                    res.status(404).json({
                        msg: 'not Found.'
                    })
                }

            })
            .catch(err => {
                res.status(500).json({
                    msg: err.message
                })
            })
    },

    favorite(req, res) {
        let joke = {}
        Joke.create({
            joke: req.body.joke
        })
            .then(newJoke => {
                joke = newJoke
                return User
                    .findByIdAndUpdate(req.authenticated._id, {
                        $push: { jokeList: newJoke._id }
                    })
            })
            .then(updatedUser => {
                // console.log(newJoke,'dalem update=======')
                res.status(201).json(joke)
            })
            .catch(err => {
                res.status(500).json({
                    msg: err.message
                })
            })
    },

    unfavorite(req, res) {
        let deletedJoke = {}
        Joke
            .findByIdAndDelete(req.params.id)
            .then(deleted => {
                deletedJoke = deleted
                return User
                    .findByIdAndUpdate(req.authenticated._id, {
                        $pull: { jokeList: req.params.id }
                    })
            })
            .then(pulled => {
                console.log(deletedJoke, 'dalem deleted=====')
                res.status(200).json(deletedJoke)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    msg: err.message
                })
            })

    },

    login(req, res) {
        User
            .findOne({
                email: req.body.email,
            })
            .then(found => {
                if (!found) {
                    throw new Error(401)
                } else {
                    if (bcrypt.compare(req.body.password, found.password) === true) {
                        let jwtData = {
                            _id: found._id,
                            email: found.email,
                            userId: found._id
                        }
                        let token = jwt.sign(jwtData, process.env.SECRET_KEY)
                        res.status(201).json({
                            access_token: token,
                        })
                    } else {
                        throw new Error(401)
                    }
                }
            })
            .catch(err => {
                if (err.message == "401") {
                    res.status(401).json({
                        msg: 'email/password wrong.'
                    })
                } else {
                    res.status(500).json({
                        msg: 'internal server error'
                    })
                }
            })
    },


}