import {model, models, Schema} from "mongoose";
import {IKnowledgeCategory} from "@/models/knowledge-category";

// export type KnowledgeType = 'training' | 'renovation' | 'farming' | 'model';

export interface IKnowledge {
    _id?: string;
    media?: {
        url: string | File,
        media_type: 'video' | 'image'
    },
    category: string | null | IKnowledgeCategory,
    name: string,
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
    is_deleted?: boolean,
    createdAt?: string
}
//
// export enum KnowledgeTypes {
//     training = 'training',
//     renovation = 'renovation',
//     farming = 'farming',
//     model = 'model',
// }

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
        type: Schema.Types.ObjectId,
        ref: 'KnowledgeCategories'
    },
    name: {
        type: String,
        required: true,
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

const Knowledge = models?.Knowledge || model("Knowledge", KnowledgeSchema);
export default Knowledge;
