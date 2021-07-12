const dotenv = require("dotenv")
dotenv.config()
const express = require("express")
const app = express()
const mongoose = require('mongoose');
const ejs = require("ejs")
const path = require("path")
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const flash = require("express-flash")
const MongoDbStore = require("connect-mongo");
const passport = require("passport");
const Emitter = require('events')

const PORT = process.env.PORT || 3000
//database connection
const url = 'mongodb+srv://Pranav:{pranav1@}@cluster0.gvv4f.mongodb.net/panipuri?retryWrites=true&w=majority';
mongoose.connect(url, {
         useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true
});
const connection = mongoose.connection;
connection.once('open', () => {
         console.log('database connected')
}).catch(err => {
         console.log('database not connected')
})

app.use(express.urlencoded({
         extended: false
}))
app.use(express.json())
// session store
const mongoStore = MongoDbStore.create ({
         mongoUrl: url,
         collection: 'session'
})

// Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

// session config
app.use(session({
         secret: 'thisismysectet',
         resave: false,
         store: mongoStore,
         saveUninitialized: false,
         cookie: {
                  maxAge: 1000 * 60 * 60 * 24
         } //24 hovers
}))
app.use(flash())

// passport config
const passportinit = require('./app/config/passport')
passportinit(passport)
app.use(passport.initialize());
app.use(passport.session());

//global midalware
app.use((req, res, next)=> {
         res.locals.session = req.session
         res.locals.user = req.user
         next()
})

// Set template engine
app.use(expressLayouts)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

app.use(express.static('public'))

require('./routes/web')(app)

const server = app.listen(PORT , () => {
            console.log(`Listening on port ${PORT}`)
        })

// Socket

const io = require('socket.io')(server)
io.on('connection', (socket) => {
      // Join
      socket.on('join', (orderId) => {
        socket.join(orderId)
      })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})