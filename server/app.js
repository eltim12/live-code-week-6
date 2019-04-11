require("dotenv").config()

const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000

const mongoose = require("mongoose")
mongoose.set("useFindAndModify", false)

mongoose.connect(`mongodb://localhost/classic_fox_live_code_1`, { useNewUrlParser: true })

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

const indexRoutes = require('./routes/indexRoutes')

app.use('/', indexRoutes)

app.listen(port, () => {
    console.log("listening on port" + port)
})
