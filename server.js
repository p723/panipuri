const express = require("express")
const app = express()

const ejs = require("ejs")
const path = require("path")
const expressLayouts = require("express-ejs-layouts")

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`)
})


app.get('/', (req, res) => {
        res.send('home')
} )
