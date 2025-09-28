import {model, models, Schema} from "mongoose";
import {IPolicyDocument} from "@/models/policy-document";

export interface INewsAndEvents {
    _id?: string;
    image_url: string | File;
    type: string;
    date: string | Date;
    title: string;
    description: string;
    related_posts: string[] | INewsAndEvents[];
    is_deleted?: boolean;
    is_highlight?: boolean;
    order?: number;
    createdAt?: string;
}

export interface IAds {
    image_url: string | File;
    link: string;
}

export interface IHomeConfig {
    banner: {
        title?: string;
        description?: string;
        image_url: string | File;
    }[],
    introduction: {
        image_url: string | File;
        content: string;
    };
    agricultural_policy: string[] | IPolicyDocument[];
    knowledge_bank_video_url: string;
    news_and_events: INewsAndEvents[];
    ads: IAds[]
}

const ConfigSchema = new Schema({
    home: {
        banner: [{
            title: {
                type: String,
                default: null
            },
            description: {
                type: String,
                default: null
            },
            image_url: {
                type: String,
                required: true
            }
        }],
        introduction: {
            image_url: {
                type: String,
                required: true
            },
            content: {
                type: String,
                required: true
            }
        },
        agricultural_policy: {
            type: [Schema.Types.ObjectId],
            ref: 'PolicyDocuments'
        },
        knowledge_bank_video_url: {
            type: String,
            required: true
        },
        news_and_events: {
            type: [Schema.Types.ObjectId],
            ref: "NewsEvents",
        },
        ads: [{
            image_url: {
                type: String,
                required: true
            },
            link: {
                type: String,
                required: true
            }
        }]
    },
    policy: {
        strategy: {
            draft_ppt_link: {
                type: String,
                required: true
            },
            downloadable: {
                type: Boolean,
                default: true
            },
            download_notification: {
                type: String,
                default: ''
            },
            downloads: [{
                name: {
                    type: String,
                    required: true
                },
                file_url: {
                    type: String,
                    required: true
                }
            }]
        },
        plan: {
            draft_ppt_link: {
                type: String,
                required: true
            },
            downloadable: {
                type: Boolean,
                default: true
            },
            download_notification: {
                type: String,
                default: ''
            },
            downloads: [{
                name: {
                    type: String,
                    required: true
                },
                file_url: {
                    type: String,
                    required: true
                }
            }]
        },
        document: {}
    },
    traffic: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Config = models.Config || model("Config", ConfigSchema);
export default Config;
