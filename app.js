const passport = require('passport');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const db = require("./connection")
const expressLayouts = require('express-ejs-layouts');
const indexRoute = require('./routes/index');
const userRoute = require('./routes/user');

require('./passport')(passport);
const app = express();

const morgan = require('morgan');

require('dotenv').config();
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(morgan('dev'));

let store = new MongoStore({
    mongoUrl: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.pp8efut.mongodb.net/GoogleOauth?retryWrites=true&w=majority`,
    collection: "sessions"
 });

// SESSION MIDDLEWARE 
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }, // THIS WON'T WORK WITHOUT HTTPS
    store: store
}));

// PASSPORT MIDDLEWARE 
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next)=>{
    if(req.isAuthenticated){
        console.log("Now we can set global variable");
        res.locals.user = req.user;
        next();
    }else{
        console.log("Now we can not set global variable");
        res.locals.user = null;
        next();
    }
});

app.use('/', indexRoute);
app.use('/auth', userRoute);

app.listen(4000, () => {
    console.log('Server is running on: 4000');
});