import {model, models, Schema} from "mongoose";

export interface IPolicyDocument {
    _id?: string,
    title: string,
    image_url: string | File,
    description: {
        description_type: 'link' | 'text',
        content: string,
    },
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
    description: {
        description_type: {
            type: String,
            enum: ['link', 'text'],
            required: true
        },
        content: {
            type: String,
            required: true
        }
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
