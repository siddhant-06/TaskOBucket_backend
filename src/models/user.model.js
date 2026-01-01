import mongoose from 'mongoose';

// Define the user schema for MongoDB using Mongoose
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'user', 'supplier'],
      default: 'user',
    },
    dob: { type: Date, default: Date.now },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
