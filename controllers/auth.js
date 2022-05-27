const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const { generateJWT } = require("../helpers/generateJWT");
const { googleVerify } = require("../helpers/googleVerify");

//Model Users
const User = require("../models/user");

//POST REQUEST - LOGIN
const login = async (req = request, res = response) => {
  //getting body
  const { email, password } = req.body;

  try {
    //check if email exists in database
    const user = await User.findOne({ email });

    //check if email exists in database
    if (!user) {
      return res.status(400).json({
        msg: `This email: ${email} doesn't exist in database records. - email`,
      });
    }

    //check if user is active
    if (!user.status) {
      return res.status(400).json({
        msg: `This email: ${email} doesn't exist in database records. - status`,
      });
    }

    //check if password matches
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: `This email: ${email} doesn't exist in database records. - password`,
      });
    }

    //generate a jsonwebtoken

    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Something is wrong with server. Please contact with the administrator",
    });
  }
};

const googleSignIn = async (req = request, res = response) => {
  const { id_token } = req.body;

  try {
    const { email, name, img } = await googleVerify(id_token);
    let user = await User.findOne({ email });

    if (!user) {
      const data = {
        name,
        email,
        img,
        password: ":P",
        google: true,
      };
      user = new User(data);
      await user.save();
    }

    if (!user.status) {
      res.status(401).json({
        msg: "User blocked. contact administrator",
      });
    }

    const token = await generateJWT(user.id);
    res.json({
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Google token is not valid.",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
