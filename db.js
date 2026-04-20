import mongoose from "mongoose";
import { Book } from "./models/Book.js";
import { User } from "./models/User.js";
import "dotenv/config";

export const connectToDB = async () => {
  // http://localhost:27017
  await mongoose.connect(process.env["MONGO_URL"]);

  console.log(" Mongoose Connected successfully");
};

export const models = { Book, User };
