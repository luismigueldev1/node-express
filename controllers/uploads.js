const path = require("path");
const fs = require("fs");
const { response, request } = require("express");
const cloudinary = require("cloudinary").v2;
const { upload } = require("../helpers/upload");
const { User, Product } = require("../models");

//clodinary config
cloudinary.config(process.env.CLOUDINARY_URL);

const uploadFile = async (req = request, res = response) => {
  try {
    const fileName = await upload(req.files, undefined, "images");
    res.json({ fileName });
  } catch (error) {
    res.status(400).json({
      msg: error,
    });
  }
};

const updateImage = async (req = request, res = response) => {
  const { collection, id } = req.params;
  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: "User not found",
        });
      }
      break;
    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: "Product not found",
        });
      }
      break;
    default:
      return res.status(500).json({ msg: "Need validate this" });
  }

  //Delete images if exist
  if (model.img) {
    //delete image from server
    const imagePath = path.join(__dirname, "../uploads", collection, model.img);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  const filename = await upload(req.files, undefined, collection);
  model.img = filename;
  await model.save();

  res.json({ model });
};

const getImage = async (req = request, res = response) => {
  const { collection, id } = req.params;
  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: "User not found",
        });
      }
      break;
    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: "Product not found",
        });
      }
      break;
    default:
      return res.status(500).json({ msg: "Need validate this" });
  }

  //Return image
  if (model.img) {
    const imagePath = path.join(__dirname, "../uploads", collection, model.img);
    if (fs.existsSync(imagePath)) {
      return res.sendFile(imagePath);
    }
  }

  const noImage = path.join(__dirname, "../assets/no-image.jpg");
  res.sendFile(noImage);
};

const updateImageCloudinary = async (req = request, res = response) => {
  const { collection, id } = req.params;
  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: "User not found",
        });
      }
      break;
    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: "Product not found",
        });
      }
      break;
    default:
      return res.status(500).json({ msg: "Need validate this" });
  }

  //Delete images if exist
  if (model.img) {
    //get plubic_id from image url
    const nameSplit = model.img.split("/");
    const name = nameSplit[nameSplit.length - 1];
    const [public_id] = name.split(".");
    //delete image from cloudinary
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  model.img = secure_url;
  await model.save();

  res.json(model);
};

module.exports = {
  uploadFile,
  updateImage,
  getImage,
  updateImageCloudinary,
};
