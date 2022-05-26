const User = require("../models/user");
const Role = require("../models/role");

const isEmailAlreadyUsed = async (email = "") => {
  const exist = await User.findOne({ email });
  if (exist) {
    throw new Error(`Email: ${email} is already used`);
  }
};

const isValidRole = async (role = "") => {
  const exist = await Role.findOne({ role });
  if (!exist) {
    throw new Error(`Role: ${role} is not valid`);
  }
};

const existsUserId = async (id = "") => {
  const exist = await User.findById(id);
  if (!exist) {
    throw new Error(`User id: ${id} is not in Database`);
  }
};

module.exports = {
  isEmailAlreadyUsed,
  isValidRole,
  existsUserId,
};
