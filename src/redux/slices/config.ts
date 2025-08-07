import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    home: {
        banner: {
            title: '',
            description: '',
            image_url: '',
        },
        introduction_image_url: '',
        agricultural_policy: '',
        knowledge_bank_video_url: '',
        news_and_events: []
    },
    global: {}
}

const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        setHomeConfig: (state, action) => ({
            ...state,
            home: action.payload
        }),
        setGlobalConfig: (state, action) => ({
            ...state,
            global: action.payload
        })
    },
})

export const {
    setHomeConfig,
    setGlobalConfig
} = configSlice.actions

export default configSlice.reducer
