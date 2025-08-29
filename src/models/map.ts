import {model, models, Schema} from "mongoose";

export interface IMap {
    _id?: string;
    name: string;
    image_url: string | File;
    createdAt?: string;
}

const MapSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image_url: {
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

const MapModel = models.Map || model("Map", MapSchema);
export default MapModel;
