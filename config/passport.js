const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

/**
 * Called when user is added into the session.
 *
 * It stores only the unique id of the user into the session.
 *
 */
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

/**
 * Called when we need the values of the user
 *
 * It takes the id into the session then finds the user in the database
 * and returns it.
 *
 * You can store whole user data into the session to avoid calling database for user.
 */
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    async function (req, username, password, done) {
      console.log("About to try finding user: ", { email: username });
      try {
        const user = await User.findOne({
         email: username
        }).select("+password");

        if (!user) {
          console.log("User does not exist");
          return done(null, false, { message: "Incorrect username." });
        } else if (!(await user.validPassword(password))) {
          console.log("Incorrect password");
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user); //Successfully validated the user
      } catch (error) {
        console.log("An error occurred while fetching user");
        return done(error);
      }
    }
  )
);

module.exports = passport;
