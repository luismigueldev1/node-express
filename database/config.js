const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connection with Database is: OK");
  } catch (error) {
    console.log(error);
    throw new Error("Error: trying to connect with database");
  }
};

module.exports = {
  dbConnection,
};
