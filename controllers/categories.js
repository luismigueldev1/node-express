const { response, request } = require("express");
const Category = require("../models/category");

const getCategories = async (req = request, res = response) => {
  const { limit = 5, skip = 0 } = req.query;
  const query = { status: true };
  const [countCategories, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      .populate("createdBy", "name")
      .limit(Number(limit))
      .skip(Number(skip)),
  ]);
  //response
  res.json({
    countCategories,
    categories,
  });
};

const getCategory = async (req = request, res = response) => {
  const id = req.params.id;
  const query = { status: true };
  const category = await Category.findById(id)
    .where(query)
    .populate("createdBy", "name");
  if (!category) {
    return res.status(404).json({
      message: "Category not found",
    });
  }
  res.json(category);
};

const createCategory = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();
  //check if category exists
  const existsCategory = await Category.findOne({ name });
  if (existsCategory) {
    return res.status(400).send({
      msg: `Category: ${name} already exists`,
    });
  }
  //generate new category
  const data = {
    name,
    createdBy: req.user._id,
  };
  //save category
  const category = new Category(data);
  await category.save();
  //response
  res.status(201).json(category);
};

const updateCategory = async (req = request, res = response) => {
  const id = req.params.id;
  const name = req.body.name.toUpperCase();

  const data = {
    name,
    createdBy: req.user._id,
  };

  //check if category exists
  const existsCategory = await Category.findOne({ name });
  if (existsCategory) {
    return res.status(400).send({
      msg: `Category: ${name} already exists`,
    });
  }

  //update category
  const category = await Category.findByIdAndUpdate(id, data, { new: true });
  //response
  res.json(category);
};

const deleteCategory = async (req = request, res = response) => {
  const id = req.params.id;

  //check if category exists
  const existsCategory = await Category.findById(id);
  if (!existsCategory) {
    return res.status(404).send({
      msg: "Category not found",
    });
  }

  //update category
  const category = await Category.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );

  res.json(category);
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
