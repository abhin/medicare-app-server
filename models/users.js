import mongoose from "mongoose";
import {
  USER_ROLE_ADMIN,
  USER_ROLE_PATIENT,
  USER_ROLE_DOCTOR,
} from "./userRoles.js";
import { FEMALE, MALE, OTHERS } from "./genders.js";

const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
      index: true,
    },
    password: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    gender: {
      type: Number,
      enum: [FEMALE.id, MALE.id, OTHERS.id],
      required: false,
      index: true,
    },
    about: {
      type: String,
      required: false,
    },
    building: {
      type: String,
      required: false,
    },
    street: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    zip: {
      type: String,
      required: false,
    },
    profilePic: {
      type: String,
      required: false,
    },
    role: {
      type: Number,
      enum: [USER_ROLE_ADMIN.id, USER_ROLE_PATIENT.id, USER_ROLE_DOCTOR.id],
      required: false,
      index: true,
    },
    status: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", usersSchema);

export default Users;
