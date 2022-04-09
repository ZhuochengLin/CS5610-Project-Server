import mongoose from "mongoose";
import User from "../models/User";

const UserSchema = new mongoose.Schema<User>({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: String,
    firstName: String,
    lastName: String,
    profilePhoto: String,
    biography: String,
    dateOfBirth: Date,
    phone: String
}, {collection: "users"});
export default UserSchema;