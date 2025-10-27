import mongoose from "mongoose";
import { DB_NAME } from "../utils/constants.js";



export const connectToDatabase = (async () => {
  try { 
    const connection =    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    console.log(` Connected to MongoDB database: ${connection.connections[0].name}`);
  } catch (error) {
    console.error("Error connecting to MongoDB database:", error);
    process.exit(1);
  } });