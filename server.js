const express = require("express")
const app = express()

const ejs = require("ejs")
const path = require("path")
const expressLayouts = require("express-ejs-layouts")

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`)
})

//set template engine
app.use(expressLayouts)
app.use(express.static(path.join(__dirname, 'resources')));

// Set 'views' directory for any views 
// being rendered res.render()
app.set('views', path.join(__dirname, 'views'));

// Set view engine as EJS
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
        res.render('home')
} )
