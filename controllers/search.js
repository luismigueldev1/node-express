const { request, response } = require("express");
const { ObjectId } = require("mongoose").Types;
const User = require("../models/user");
const Category = require("../models/category");
const Product = require("../models/product");

const validCollections = ["users", "categories", "products"];

const searchUsers = async (query = "", res = response) => {
  const isMongoId = ObjectId.isValid(query);
  if (isMongoId) {
    const user = await User.findById(query);

    return res.json({
      results: user ? [user] : [],
    });
  }

  const regex = new RegExp(query, "i");
  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ status: true }],
  });

  res.json({
    results: users,
  });
};

const searchCategories = async (query = "", res = response) => {
  const isMongoId = ObjectId.isValid(query);
  if (isMongoId) {
    const categories = await Category.findById(query).populate(
      "createdBy",
      "name"
    );

    return res.json({
      results: categories ? [categories] : [],
    });
  }

  const regex = new RegExp(query, "i");
  const categories = await Category.find({
    name: regex,
    status: true,
  }).populate("createdBy", "name");

  res.json({
    results: categories,
  });
};

const searchProducts = async (query = "", res = response) => {
  const isMongoId = ObjectId.isValid(query);
  if (isMongoId) {
    const products = await Product.findById(query)
      .populate("createdBy", "name")
      .populate("category", "name");

    return res.json({
      results: products ? [products] : [],
    });
  }

  const regex = new RegExp(query, "i");
  const products = await Product.find({
    name: regex,
    status: true,
  })
    .populate("createdBy", "name")
    .populate("category", "name");

  res.json({
    results: products,
  });
};

const search = (req = request, res = response) => {
  const { collection, query } = req.params;

  if (!validCollections.includes(collection)) {
    return res.status(400).json({
      msg: `Invalid collection, please use one of the following:  
        ${validCollections.join(", ")}`,
    });
  }

  switch (collection) {
    case "users":
      searchUsers(query, res);
      break;
    case "categories":
      searchCategories(query, res);
      break;
    case "products":
      searchProducts(query, res);
      break;
    default:
      res.status(500).json({
        msg: "Internal server error, Contact the administrator for add new collection",
      });
      break;
  }
};

module.exports = {
  search,
};
