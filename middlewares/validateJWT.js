const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");
  const jwtSecret = process.env.JWT_SECRET;

  if (!token) {
    return res.status(401).json({
      msg: "Token is required",
    });
  }

  try {
    //Verfying if JWT is valid.
    const { uid } = jwt.verify(token, jwtSecret);

    //Getting User Authenticated and puting in authUser
    const user = await User.findById(uid);

    if (!user) {
      return res.status(401).json({
        msg: "Token is not valid - User doesn't exists in DB",
      });
    }

    //verify if user is avaliable (status = true)
    if (!user.status) {
      return res.status(401).json({
        msg: "Token is not valid - User deleted",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token is not valid or expired",
    });
  }
};

module.exports = {
  validateJWT,
};
