import {model, models, Schema} from "mongoose";

export interface ISection {
    _id?: string;
    name: string;
    type: string;
    parent_id: string | null;
    header_key: string;
    image_url: string | File;
    post_id: string | null;
    order: number;
    createdAt?: string;
    children?: ISection[];
    is_deleted?: boolean;
}

export enum SectionType {
    'section' = 'section',
    'list' = 'list',
    'post' = 'post',
}

export enum HeaderKey {
    'policy' = 'policy',
    'map' = 'map',
    'knowledge' = 'knowledge',
    'news' = 'news',
    'contact' = 'contact',
    'introduction' = 'introduction'
}

const SectionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(SectionType),
        default: SectionType["post"]
    },
    parent_id: {
        type: Schema.Types.ObjectId,
        ref: 'Section',
        default: null
    },
    header_key: {
        type: String,
        enum: Object.values(HeaderKey),
    },
    image_url: {
        type: String,
        default: ''
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref: 'Posts',
        default: null
    },
    order: {
        type: Number,
        default: 0
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const SectionModel = models?.Section || model("Section", SectionSchema);
export default SectionModel;
