import mongoose from "mongoose";
import Admin from "../models/Admin";

const AdminSchema = new mongoose.Schema<Admin>({
    username: {type: String, required: true},
    accessLevel: {type: String, default: "read;update;delete"}
}, {collection: "admins"});
export default AdminSchema;