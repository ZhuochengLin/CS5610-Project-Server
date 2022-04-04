import mongoose from "mongoose";
import User from "../models/User";

const UserSchema = new mongoose.Schema<User>({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: String,
    firstName: String,
    lastName: String,
    profilePhoto: String,
    biography: String,
    dateOfBirth: Date
}, {collection: "users"});
export default UserSchema;