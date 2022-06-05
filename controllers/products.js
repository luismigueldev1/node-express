const Product = require("../models/product");

const getProducts = async (req = request, res = response) => {
  const { limit = 5, skip = 0 } = req.query;
  const query = { status: true };
  const [countProducts, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate("createdBy", "name")
      .populate("category", "name")
      .limit(Number(limit))
      .skip(Number(skip)),
  ]);
  //response
  res.json({
    countProducts,
    products,
  });
};

const getProduct = async (req = request, res = response) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate("createdBy", "name")
    .populate("category", "name");
  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }
  res.json(product);
};

const createProduct = async (req = request, res = response) => {
  const { status, user, ...body } = req.body;
  const userId = req.user._id;
  const name = body.name.toUpperCase();

  const exitsProduct = await Product.findOne({ name });
  if (exitsProduct) {
    return res.status(400).send({
      msg: `Product: ${name} already exists`,
    });
  }
  const data = {
    ...body,
    name,
    createdBy: userId,
  };
  const product = new Product(data);
  await product.save();
  res.status(201).json(product);
};

const updateProduct = async (req = request, res = response) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { user, ...body } = req.body;

  if (body.name) {
    body.name = body.name.toUpperCase();
  }

  //update
  const data = {
    ...body,
    createdBy: userId,
  };

  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  //response
  res.json(product);
};

const deleteProduct = async (req = request, res = response) => {
  const id = req.params.id;
  //update
  const data = {
    status: false,
    createdBy: req.user._id,
  };

  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  //response
  res.json(product);
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
