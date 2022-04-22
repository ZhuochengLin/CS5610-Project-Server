import mongoose from "mongoose";
import Super from "../models/Super";

const SuperSchema = new mongoose.Schema<Super>({
    username: {type: String, required: true}
}, {collection: "supers"});
export default SuperSchema;