const router = require("express").Router();

//auth logout
router.route("/logout").get((req, res) => {
  req.logOut();
  res.clearCookie("connect.sid").send({
    success: true,
    msg: "User has been logged out!",
    user: req.email
  });
});

//check if user is already logged in
router.route("/login").get((req, res) => {
  if (req.user) {
    res.send({
      success: true,
      msg: "User is logged in already!",
      user: req.user
    });
  } else {
    //console.log("user is not logged in yet");
    res.status(500).send({
      success: false,
      msg: "User is not logged in yet"
    });
  }
});


module.exports = function (passport) {

  //auth login
  router.route("/login").post(function (req, res, next) {
    passport.authenticate("local", { session: true }, function (err, user) {
      if (err) {
        return next(err); 
      }

      if (!user) {
        return res.send({ success: false, message: "Authentication failed" });
      }

      req.login(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }

        return res.send({
          success: true,
          message: "Authentication succeeded",
          user
        });
      });
    })(req, res, next);
  });

 

  return router;
};

