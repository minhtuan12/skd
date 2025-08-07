import {model, models, Schema} from "mongoose";

export interface IAdmin {
    _id?: string;
    username: string;
    password: string;
}

const AdminSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});

const Admin = models.Admin || model("Admin", AdminSchema);
export default Admin;
