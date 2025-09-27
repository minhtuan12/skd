import {model, models, Schema} from "mongoose";

const NewsEventsSchema = new Schema({
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
        type: JSON,
        required: true
    },
    related_posts: {
        type: [Schema.Types.ObjectId],
        ref: "NewsEvent"
    },
    is_highlight: {
        type: Boolean,
        default: false
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const NewsEvents = models.NewsEvent || model("NewsEvent", NewsEventsSchema);
export default NewsEvents;
