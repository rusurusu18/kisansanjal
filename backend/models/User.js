import mongoose from "mongoose";
import { ROLES } from "../utils/roles.js"; 

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.BUYER,
    },

    cartItems: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { minimize: false }
);

const User = mongoose.model("User", userSchema);
export default User;