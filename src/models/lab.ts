import {model, models, Schema} from "mongoose";

export interface ILab {
    _id?: string;
    name: string;
    category: string;
    address: string;
    location: {
        type: string;
        coordinates: number[];
    };
    first_license_date: string | Date;
    validity_time: string | Date;
    decision: string;
    is_deleted?: boolean;
    createdAt?: string
}

const LabSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            required: true,
            default: 'Point'
        },
        coordinates: {
            type: [Number, Number],
            required: true
        }
    },
    first_license_date: {
        type: Date,
        required: true
    },
    validity_time: {
        type: Date,
        required: true
    },
    decision: {
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

const Lab = models.Labs || model("Labs", LabSchema);
export default Lab;
