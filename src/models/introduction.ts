import {model, models, Schema} from "mongoose";

export interface IIntroduction {
    _id?: string;
    project: string;
    land: string;
    createdAt?: string;
}

const IntroductionSchema = new Schema({
    land: {
        type: String,
    },
    project: {
        type: String,
    },
}, {
    timestamps: true
});

const IntroductionModel = models.Introduction || model("Introduction", IntroductionSchema);
export default IntroductionModel;
