import {model, models, Schema} from "mongoose";

export interface ITreeType {
    _id?: string;
    name: string;
    createdAt?: string;
}

const TreeTypeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const TreeType = models.TreeType || model("TreeType", TreeTypeSchema);
export default TreeType;
