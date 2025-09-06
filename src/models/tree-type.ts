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

const TreeType = models.TreeTypes || model("TreeTypes", TreeTypeSchema);
export default TreeType;
