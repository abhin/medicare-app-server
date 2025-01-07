import mongoose from "mongoose";
import {
  USER_ROLE_ADMIN,
  USER_ROLE_PATIENT,
  USER_ROLE_DOCTOR,
} from "./userRoles.js";
import { FEMALE, MALE, OTHERS } from "./gender.js";

const usersSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
      index: true,
    },
    password: { type: String, required: false },
    role: {
      type: Number,
      required: false,
      enum: [USER_ROLE_ADMIN.id, USER_ROLE_PATIENT.id, USER_ROLE_DOCTOR.id],
      index: true,
      default: USER_ROLE_PATIENT.id,
    },
    gender: {
      type: Number,
      required: false,
      enum: [FEMALE.id, MALE.id, OTHERS.id],
      index: true,
    },
    status: { 
      type: Boolean, 
      default: false, 
      enum: [true, false],
      index: true 
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", usersSchema);

export default Users;
