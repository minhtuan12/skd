import {model, models, Schema, Types} from "mongoose";

export interface INewsAndEvents {
    _id?: string;
    image_url: string | File;
    type: string;
    date: string | Date;
    title: string;
    description: string;
    is_deleted?: boolean;
}

export interface IHomeConfig {
    banner: {
        title: string;
        description: string;
        image_url: string | File;
    },
    introduction: {
        image_url: string | File;
        content: string;
    };
    agricultural_policy: string;
    knowledge_bank_video_url: string | File;
    news_and_events: INewsAndEvents[]
}

export interface IPolicyConfig {
    strategy: {
        draft_ppt_link: string;
        converted_image_urls: string[];
    },
    plan: {
        draft_ppt_link: string;
        converted_image_urls: string[];
    },
    document: {}
}

export interface IFooterConfig {
    social: {
        facebook_url: string;
        youtube_url: string;
        email: string;
    },
    contact: {
        address: string,
        phone: string,
        email: string,
    },
    partners_and_sponsors: string[]
}

export interface IConfig {
    _id?: string;
    home: IHomeConfig;
    footer: IFooterConfig;
    news_events: INewsAndEvents[]
}

const NewsAndEventsSchema = new Schema({
    image_url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {_id: true});

const ConfigSchema = new Schema({
    home: {
        banner: {
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            image_url: {
                type: String,
                required: true
            }
        },
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
            type: String,
            required: true
        },
        knowledge_bank_video_url: {
            type: String,
            required: true
        },
        news_and_events: {
            type: [Types.ObjectId],
            ref: "NewsEvents",
        }
    },
    policy: {
        strategy: {
            draft_ppt_link: {
                type: String,
                required: true
            },
            converted_image_urls: {
                type: [String],
                required: true
            }
        },
        plan: {
            draft_ppt_link: {
                type: String,
                required: true
            },
            converted_image_urls: {
                type: [String],
                required: true
            }
        },
        document: {}
    },
    footer: {
        social: {
            facebook_url: {
                type: String,
                required: false,
                default: ''
            },
            youtube_url: {
                type: String,
                required: false,
                default: ''
            },
            email: {
                type: String,
                required: false,
                default: ''
            }
        },
        contact: {
            address: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            }
        },
        partners_and_sponsors: [{
            type: String,
            required: true
        }]
    }
}, {
    timestamps: true
});

const Config = models.Config || model("Config", ConfigSchema);
export default Config;
