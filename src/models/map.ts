import {model, models, Schema} from "mongoose";

export interface IMap {
    _id?: string;
    name: string;
    source: string;
    image_url: string | File;
    data_url: string | null;
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
    data_url: {
        type: String,
        default: null
    },
    source: {
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
