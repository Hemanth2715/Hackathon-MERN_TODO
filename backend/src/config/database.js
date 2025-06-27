const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI =
      "mongodb+srv://harishvimala22:DNwJnhdrTfUj2yLh@todo.qml83mg.mongodb.net/";

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
