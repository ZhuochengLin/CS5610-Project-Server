import mongoose from "mongoose";
import Super from "../models/Super";

const SuperSchema = new mongoose.Schema<Super>({
    username: {type: String, required: true},
    accessLevel: {type: String, default: "create;read;update;delete"}
}, {collection: "supers"});
export default SuperSchema;