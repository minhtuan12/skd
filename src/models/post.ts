import {model, models, Schema} from "mongoose";

export interface IPost {
    _id?: string;
    image_url?: string | File;
    title: string,
    text: string,
    slide: {
        url: string | null,
        downloadable: boolean,
    },
    pdf: {
        url: string | null,
        downloadable: boolean,
    },
    downloads: [{ name: string, file_url: string }]
    link: string | null,
    video_url: string | null;
    related_posts: IPost[] | string[];
    header_key: string;
    order: number;
    is_deleted?: boolean,
    createdAt?: string,
}

const PostSchema = new Schema({
    title: {
        type: String
    },
    image_url: {
        type: String
    },
    text: {
        type: String,
    },
    slide: {
        url: {
            type: String
        },
        downloadable: {
            type: Boolean
        }
    },
    pdf: {
        url: {
            type: String
        },
        downloadable: {
            type: Boolean
        }
    },
    link: {
        type: String
    },
    video_url: {
        type: String
    },
    downloads: [{
        name: {
            type: String,
        },
        file_url: {
            type: String,
        }
    }],
    related_posts: {
        type: [Schema.Types.ObjectId],
        ref: "Posts"
    },
    header_key: {
        type: String,
    },
    order: {
        type: Number,
        default: 0,
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Post = models.Posts || model("Posts", PostSchema);
export default Post;
