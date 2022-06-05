const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

//Model Users
const User = require("../models/user");

//POST REQUEST - CREATE USER
const createUser = async (req = request, res = response) => {
  //getting body
  const { name, email, password, role } = req.body;

  //new instance User model
  const user = new User({
    name,
    email,
    role,
  });

  //Ecrypting password
  const salts = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salts);

  //saving user
  await user.save();

  //response
  res.status(201).json(user);
};

//PUT REQUEST - UPDATE USER
const updateUser = async (req = request, res = response) => {
  //getting params and body
  const id = req.params.id;
  const { password, email, google, ...update } = req.body;

  //Ecrypting password if was sended
  if (password) {
    const salts = bcryptjs.genSaltSync();
    update.password = bcryptjs.hashSync(password, salts);
  }

  //update user
  const user = await User.findByIdAndUpdate(id, update, {
    new: true,
  });

  //response
  res.json(user);
};

//GET REQUEST - GET USER
const getUsers = async (req = request, res = response) => {
  const { limit = 5, skip = 0 } = req.query;
  const query = { status: true };

  const [countUsers, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).limit(Number(limit)).skip(Number(skip)),
  ]);

  //response
  res.json({
    countUsers,
    users,
  });
};

const deleteUser = async (req = request, res = response) => {
  const { id } = req.params;
  const uid = req.uid;
  const authUser = req.user;

  //delete from DB (not recommended)
  //const user = await User.findByIdAndDelete(id);

  //Updating Status to false (recommended method to prevent errors with db relations)
  const user = await User.findOneAndUpdate(
    id,
    { status: false },
    { new: true }
  );

  //response
  res.json({
    user,
    authUser,
    uid,
  });
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
};
