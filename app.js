const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoose = require("mongoose");
var session = require("express-session");
const MongoStore = require("connect-mongo");


require("dotenv").config();


const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const buildingRouter = require('./routes/building');
const classroomRouter = require('./routes/classroom');


const app = express();

const uri = process.env.DB_URL
const port = process.env.PORT || 5000

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


//Connect to database
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    autoIndex: false,
    useFindAndModify: false
  })
  .then(() => console.log("Successfully connected to database!"))
  .catch((e) => console.log(e, "Unable to connect to database"));


  /**
 * MongoStore is used to store session data.  We will learn more about this in the post.
 */
const sessionStore = MongoStore.create({
  mongoUrl: process.env.DB_URL, //from mongoose connection above
  collection: "sessions",
  
  
});

//Middleware for express (cookie) session
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
    secure: true,
    cookie: {
      httpOnly: true
    }
  })
);


/** Configured Passport */
const passport = require("./config/passport");

/** Initialize passport and session */
app.use(passport.initialize()); 
app.use(passport.session());

// Routes
app.use('/auth', authRouter(passport));
app.use('/users', usersRouter);
app.use('/building', buildingRouter);
app.use('/classroom', classroomRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({error: "could not load resource"});
});


try {
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
} catch (error) {
  console.log(error);
}


module.exports = app;
