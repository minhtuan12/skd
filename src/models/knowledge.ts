import {model, models, Schema} from "mongoose";
import {ITreeType} from "@/models/tree-type";

export type KnowledgeType = 'training' | 'renovation' | 'farming' | 'model';

export interface IKnowledge {
    _id?: string;
    media?: {
        url: string | File,
        media_type: 'video' | 'image'
    },
    category: KnowledgeType,
    tree_type?: string | null | ITreeType,
    name?: string,
    description?: string,
    is_deleted?: boolean,
    createdAt?: string
}

export enum KnowledgeTypes {
    training = 'training',
    renovation = 'renovation',
    farming = 'farming',
    model = 'model',
}

const KnowledgeSchema = new Schema({
    media: {
        url: {
            type: String,
            required: true,
        },
        media_type: {
            type: String,
            required: true,
            enum: ['video', 'image']
        }
    },
    category: {
        type: String,
        enum: ['training', 'renovation', 'farming', 'model'],
    },
    tree_type: {
        type: Schema.Types.ObjectId,
        ref: "TreeType",
        default: null
    },
    name: {
        type: String,
        default: null
    },
    description: {
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

const Knowledge = models?.Knowledge || model("Knowledge", KnowledgeSchema);
export default Knowledge;
