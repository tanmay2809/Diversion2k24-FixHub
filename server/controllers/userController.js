const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/StudentSchema");
// @desc : register new user
// @route: POST /users/register
// @access: public
const register = expressAsyncHandler(async (req, res) => {
  let latt = '';
  let lon = '';
  const { name, email, password,address,pincode } = req.body;
  if (!name || !email || !password || !address || !pincode) 
  {
    res.status(400);
    throw new Error("Enter all details");
  }
  const userExists = await userModel.findOne({ email });
  if (userExists) 
  {
    res.status(400);
    throw new Error("User already Exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);
  try{
    const apiKey = '7677c6e0235545eea130006a6d69d417';
    const pin = parseInt(pincode,10);
    console.log("pin : ",pin);
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${pin}&key=${apiKey}`
    );
    if (!response.ok) 
    {
      throw new Error('Error fetching geocoding data');
    }
    const data = await response.json();
    console.log(data);
    if (data.results.length > 0)
    {
      console.log(data.results[0].geometry);
      const { lat, lng } = data.results[0].geometry;
      latt=lat;
      lon=lng;
      console.log("lat : ",latt);
      console.log(typeof(latt));
      console.log("lon : ",lon);
      console.log(typeof(lon));
    }
    else
    {
      throw new Error('No results found for the given pin code');
    }
  }
  catch(err){
    console.error(err.message);
  }
  const user = await userModel.create({
    name,
    email,
    type: 'user',
    password: hashedPass,
    address,
    pincode,
    latt,
    lon,
  });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateJwt(user._id),
    address:user.address,
    pincode:user.pincode,
    lat:user.latt,
    lon:user.lon,
  });
});

// @desc : login as user
// @route: POST /users/login
// @access: public
const login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Enter all details");
  }
  const user = await userModel.findOne({
    email,
  });
  if (user && await bcrypt.compare(password, user.password)) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      type: 'user',
      token: generateJwt(user.id),
      address: user.address,
      pincode: user.pincode,
      lat:user.latt,
      lon:user.lon,
    });
  } else {
    res.status(400);
    throw new Error("Wrong credentials");
  }
});

// @desc : details of loggedin user
// @route: GET /users/me
// @access: private
const getMe = expressAsyncHandler(async (req, res) => {
    const { name, email, _id } = req.user;
    res.status(200).json({
      id: _id,
      name,
      type: 'user',
      email,
      address,
      pincode,
    });
  });

const generateJwt = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30m" });
};

module.exports = {
  login,
  register,
  getMe
};