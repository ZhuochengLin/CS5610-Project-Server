import mongoose from "mongoose";
import SuperSchema from "./SuperSchema";

const SuperModel = mongoose.model("SuperModel", SuperSchema);
export default SuperModel;