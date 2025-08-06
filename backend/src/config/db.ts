import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoURI = process.env.MONGO_URI;
export const connectDB = async() => {
    mongoose.connect(mongoURI as string)
      .then(() => console.log('MongoDB connected'))
      .catch((error) => console.error('MongoDB error: ',error))
};