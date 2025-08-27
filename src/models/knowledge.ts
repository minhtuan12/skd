import {model, models, Schema, Types} from "mongoose";

type KnowledgeType = 'training' | 'renovation' | 'farming' | 'model';

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
        enum: ['training', 'renovation', 'farming', 'model', null],
        default: null
    },
    tree_type: {
        type: Types.ObjectId,
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

const Knowledge = models.Knowledge || model("Knowledge", KnowledgeSchema);
export default Knowledge;
