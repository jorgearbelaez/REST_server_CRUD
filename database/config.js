const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_ATLAS);

    console.log("base de datos online");
  } catch (error) {
    console.log(error);
    throw new error("error a la hora de iniciar la database");
  }
};

module.exports = {
  dbConnection,
};
