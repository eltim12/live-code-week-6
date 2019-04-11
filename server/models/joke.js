const mongoose = require('mongoose')
const Schema = mongoose.Schema

const jokeSchema = new Schema({
    joke: {
        type: String
    }
})

const Joke = mongoose.model('Joke', jokeSchema)

module.exports = Joke

