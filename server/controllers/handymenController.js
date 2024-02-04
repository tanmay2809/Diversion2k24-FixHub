const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const handymen = require("../models/handymenSchema");

// @desc : register new user
// @route: POST /users/register
// @access: public
const registerHandymen = expressAsyncHandler(async (req, res) => {
  const { name, email, password, skills } = req.body;
  console.log(name, email, password, skills)
  if (!name || !email || !password || !skills ) {
    res.status(400);
    throw new Error("Enter all details");
  }
  const tutorExists = await handymen.findOne({ email });
  if (tutorExists) {
    res.status(400);
    throw new Error("tutor already Exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  const tutor = await handymen.create({
    name,
    email,
    password: hashedPass,
    skills,
  });

  res.json({
    _id: tutor._id,
    name: tutor.name,
    email: tutor.email,
    type: "handymen",
    skills: tutor.skills,
    token: generateJwt(tutor._id),
  });
});

// @desc : login as user
// @route: POST /users/login
// @access: public
const loginHandymen = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Enter all details");
  }
  const tutor = await handymen.findOne({
    email,
  });
  if (tutor && (await bcrypt.compare(password, tutor.password))) {
    res.json({
      _id: tutor.id,
      name: tutor.name,
      email: tutor.email,
      type: "handymen",
      token: generateJwt(tutor.id),
      skills: tutor.skills,
  
    });
  } else {
    res.status(400);
    throw new Error("Wrong credentials");
  }
});

// @desc : details of loggedin user
// @route: GET /users/me
// @access: private
const getHandymen = expressAsyncHandler(async (req, res) => {
  const { name, email, _id, skills} = req.user;
  res.status(200).json({
    id: _id,
    name,
    email,
    type: "handymen",
    skills,
  
  });
});

const generateJwt = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30m" });
};

module.exports = {
  registerHandymen,
  loginHandymen,
  getHandymen,
};