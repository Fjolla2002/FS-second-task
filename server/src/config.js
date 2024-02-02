import dotenv from "dotenv";
dotenv.config();

const { MONGO_URI, PORT } = process.env;

const config = {
  MONGO_URI,
  PORT,
};

export default config;