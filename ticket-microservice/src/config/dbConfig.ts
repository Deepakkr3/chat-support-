import mongoose from "mongoose";
import dotenv from "dotenv"

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });



export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URL}`, {
   
      
    });
   
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
};
