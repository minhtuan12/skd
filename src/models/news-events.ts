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
        type: String,
        required: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const NewsEvents = models.NewsEvents || model("NewsEvents", NewsEventsSchema);
export default NewsEvents;
