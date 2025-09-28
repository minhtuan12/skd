import {model, models, Schema} from "mongoose";

export interface IFooter {
    _id?: string;
    about_us: {
        text: string,
        facebook: string,
        youtube: string,
        email: string,
    },
    contact: {
        address: string,
        phone: string,
        email: string
    },
    sponsors: string[]
    createdAt?: string;
}

const FooterSchema = new Schema({
    about_us: {
        text: {
            type: String,
            default: ''
        },
        facebook: {
            type: String,
            default: ''
        },
        youtube: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            default: ''
        },
    },
    contact: {
        address: {
            type: String,
            default: ''
        },
        phone: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            default: ''
        },
    },
    sponsors: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

const FooterModel = models.Footer || model("Footer", FooterSchema);
export default FooterModel;
