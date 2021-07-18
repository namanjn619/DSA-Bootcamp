if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Bootcamp = require('./models/bootcamp');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const { bootcampSchema, reviewSchema } = require('./schemas.js');
const Review = require('./models/review');
const session = require('express-session');
const flash = require('connect-flash');
const mongoSanitize = require('express-mongo-sanitize');

//Router for CRUD:
const bootcampRoutes = require('./routes/bootcamps');
//Router for Review System:
const reviewRoutes = require('./routes/reviews');
//Router for Users:
const userRoutes = require('./routes/users');

//Authentication:
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/dsa-bootcamp';
const MongoDBStore = require("connect-mongo");
//------------------------------------------//

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(mongoSanitize({
    replaceWith: '_'
}));

//Public for JS and CSS:
app.use(express.static(path.join(__dirname, 'public')));

//Session for cookies:
const secret = process.env.SECRET || 'thisisasecret';
const sessionConfig = {
    secret,
    resave: false,
    saveUninitialized: false,
    store: MongoDBStore.create({
        mongoUrl : dbUrl
    }),
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig));

//Middlewares:
//middleware for CRUD in routes/bootcamps.js
//middleware for Reviews in routes/reviews.js

//Authentication:
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Flash Messages on screen:
app.use(flash());
app.use((req, res, next) => {
    
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
//------------------------------------------//

//mongoose setup:
// in seeds folder>>index.js
//
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
//------------------------------------------//

//EJS setup:
app.set('view engine', 'ejs');
//By default ejs files are in views folder.
app.set('views', path.join(__dirname, 'views'));
//------------------------------------------//
//Home Page route:
app.get('/', (req, res) => {
    res.render('home');
})

app.get('/about', (req, res) => {
    res.render('about');
})

//------------------------------------------//
//Routers for CRUD Application:
app.use("/bootcamps", bootcampRoutes);
//------------------------------------------//
//router for Review System:
app.use("/bootcamps/:id/reviews", reviewRoutes);
//------------------------------------------//
//router for user login:
app.use('/', userRoutes);
//------------------------------------------//
//Handling Errors and providing user side and beckend Validations
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = "oh no, something went wrong"
    res.status(statusCode).render('error', { err });
})
//------------------------------------------//
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server working at ${port}`);
})