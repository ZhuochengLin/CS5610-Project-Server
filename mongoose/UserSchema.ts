import mongoose, {Schema} from "mongoose";
import User from "../models/User";
import {ADMIN, USER} from "../utils/constants";

const UserSchema = new mongoose.Schema<User>({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: String,
    firstName: String,
    lastName: String,
    profilePhoto: {type: String, default: "masood-aslami-AEy620IRo6s-unsplash_j4vvik"},
    headerImage: {type: String, default: "barbare-kacharava-YTF0b5ERUVE-unsplash_tsygg3"},
    biography: String,
    dateOfBirth: Date,
    phone: String,
    role: {type: String, enum: [ADMIN, USER], default: USER},
    joined: {type: Date, default: Date.now}
}, {collection: "users"});
export default UserSchema;