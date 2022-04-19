import mongoose from "mongoose";
import User from "../models/User";
import {ADMIN, USER} from "../utils/constants";

const UserSchema = new mongoose.Schema<User>({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: String,
    firstName: String,
    lastName: String,
    profilePhoto: String,
    biography: String,
    dateOfBirth: Date,
    phone: String,
    role: {type: String, enum: [ADMIN, USER], default: USER}
}, {collection: "users"});
export default UserSchema;