import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    home: {
        banner: {
            title: '',
            description: '',
            image_url: '',
        },
        introduction: {
            image_url: '',
            content: ''
        },
        agricultural_policy: [],
        knowledge_bank_video_url: '',
        news_and_events: []
    },
    global: {},
    news: [],
    newsEventsResearches: []
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
        }),
        setNews: (state, action) => ({
            ...state,
            news: action.payload
        }),
        setNewsEventsResearches: (state, action) => ({
            ...state,
            newsEventsResearches: action.payload
        }),
    },
})

export const {
    setHomeConfig,
    setGlobalConfig,
    setNews,
    setNewsEventsResearches
} = configSlice.actions

export default configSlice.reducer
