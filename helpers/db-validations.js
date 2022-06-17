const User = require("../models/user");
const Role = require("../models/role");
const Category = require("../models/category");
const Product = require("../models/product");

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

const existsCategoryId = async (id = "") => {
  const exist = await Category.findById(id);
  if (!exist) {
    throw new Error(`Category id: ${id} is not in Database`);
  }
};

const existProductId = async (id = "") => {
  const exist = await Product.findById(id);
  if (!exist) {
    throw new Error(`Pro id: ${id} is not in Database`);
  }
};

const isValidCollection = async (collection = "", collections = []) => {
  if (!collections.includes(collection)) {
    throw new Error(`Collection: ${collection} is not valid`);
  }
};

module.exports = {
  isEmailAlreadyUsed,
  isValidRole,
  existsUserId,
  existsCategoryId,
  existProductId,
  isValidCollection,
};
