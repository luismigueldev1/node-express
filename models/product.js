const { model, Schema } = require("mongoose");
const category = require("./category");

const ProductSchema = Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    unique: true,
  },
  status: {
    type: Boolean,
    default: true,
    required: [true, "status is required"],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "createdBy is required"],
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "category is required"],
  },
  description: {
    type: String,
    default: "",
  },
  avaliability: {
    type: Boolean,
    default: true,
  },
});

// Cleaning category to return without password
ProductSchema.methods.toJSON = function () {
  const { __v, status, _id, ...product } = this.toObject();
  product.uid = _id;
  return product;
};

//export the model
module.exports = model("Product", ProductSchema);
