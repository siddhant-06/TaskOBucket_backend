import mongoose from 'mongoose';

// Define the user schema for MongoDB using Mongoose
const loginSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const Auth = mongoose.model('Login', loginSchema);

export default Auth;
