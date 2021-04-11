var express = require("express");
const User = require("../models/user");
const bcrypt = require('bcrypt')
var router = express.Router();
const { ObjectId } = require("mongodb");


async function generateBcryptHash(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}


router.post("/", async function (req, res, next) {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.send({ message: "User already exists", success: false });
    } else {
      const passwordHash = await generateBcryptHash(password)
      const newUser = new User({ email, password: passwordHash, id: new ObjectId() });
      await newUser.save();
      res.send({message: "User successfully created", success: true, user: newUser})
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: "User could not be created" });
  }
});


router.get("/", async function (req, res, next) {
  try {

    const allUsers = User.find()
    res.send({ success: true, message: "Retrieved all user", users: allUsers})
  } catch (error) {
    res.status(500).send({ success: false, message: "User could not be created" });
  }
});

module.exports = router;
