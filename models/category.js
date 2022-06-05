const { model, Schema } = require("mongoose");

const CategorySchema = Schema({
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
});

// Cleaning category to return without password
CategorySchema.methods.toJSON = function () {
  const { __v, status, _id, ...category } = this.toObject();
  category.uid = _id;
  return category;
};

//export the model
module.exports = model("Category", CategorySchema);
