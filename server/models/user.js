const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('../helpers/bcrypt')

let userSchema = new Schema({
    password: {
        type: String,
        required: true,
        minlength: [5, "password can't be less than 5 characters."]
    },
    email: {
        type: String,
        required: true,
        validate: [
            {
                validator: function emailValidate(value) {
                    return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value)
                },
                message: "invalid email format"
            },
            {
                validator: async function unique(value) {
                    let found = await User.findOne({ email: value })
                    if (found && found._id.toString() !== this._id.toString()) {
                        return false
                    } else {
                        return true
                    }
                },
                message: "this email taken. please choose another email."

            }
        ]
    },
    jokeList: [{
        type: Schema.Types.ObjectId,
        ref: 'Joke'
    }]

})

userSchema.pre('save', function (next) {
    this.password = bcrypt.encrypt(this.password)
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User