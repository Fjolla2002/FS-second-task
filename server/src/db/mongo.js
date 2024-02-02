import mongoose from "mongoose";
import config from "../config.js";

async function connect() {
  await mongoose.connect(config.MONGO_URI);

  console.log("Connected to MongoDB");

  mongoose.connection.on("error", (err) => {
    console.log("Error in MongoDB connection:", err);
  });
}

export default connect;
