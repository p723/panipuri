require("dotenv").config()
const express = require("express")
const app = express()
const mongoose = require('mongoose');
const ejs = require("ejs")
const path = require("path")
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const flash = require("express-flash")

const PORT = process.env.PORT || 3000

app.use(session({
        secret: "thisismysecret",
        resave: false,
        saveUninitialized:false,
        cookie: { maxage: 1000 * 60 * 60 * 24} //24 hovers
}))
app.use(flash())
//database connection
const url = 'mongodb+srv://Pranav:{pranav1@}@cluster0.gvv4f.mongodb.net/panipuri?retryWrites=true&w=majority';
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true });
const connection = mongoose.connection;
connection.once('open', () => { console.log('database connected')
}).catch(err => { console.log('database not connected') })

// Set template engine
app.use(expressLayouts)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

app.use(express.static('public'))

require('./routes/web')(app)

app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`)
})


