const User = require('../models/user')
const Joke = require('../models/joke')
const axios = require('axios');

module.exports = {
    getRandomJoke(req, res) {
        axios.get('https://icanhazdadjoke.com/', {
            headers: {
                Accept: 'application/json'
            }
        })
            .then(joke => {
                res.status(200).json(joke.data)
            })
            .catch(err => {
                res.status(500).json({
                    msg: err.message
                })
            })
    }
}