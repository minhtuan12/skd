import {model, models, Schema} from "mongoose";

export interface IPolicyDocument {
    _id?: string,
    title: string,
    image_url: string | File,
    text: string,
    slide: {
        url: string | null,
        downloadable: boolean,
    },
    pdf: {
        url: string | null,
        downloadable: boolean,
    },
    link: string | null,
    createdAt?: Date,
}

const PolicyDocumentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    text: {
        type: String,
        default: ''
    },
    slide: {
        url: {
            type: String,
            default: null
        },
        downloadable: {
            type: Boolean,
            default: false
        }
    },
    pdf: {
        url: {
            type: String,
            default: null
        },
        downloadable: {
            type: Boolean,
            default: false
        }
    },
    link: {
        type: String,
        default: null
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const PolicyDocument = models.PolicyDocuments || model("PolicyDocuments", PolicyDocumentSchema);
export default PolicyDocument;
