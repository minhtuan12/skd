import {createSlice} from "@reduxjs/toolkit";

export interface IBreadCrumb {
    title: string;
    href?: string;
}

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        breadcrumb: [],
        pageTitle: '',
        knowledgePageTitle: ''
    },
    reducers: {
        setBreadcrumb: (state, action) => ({
            ...state,
            breadcrumb: action.payload
        }),
        setPageTitle: (state, action) => ({
            ...state,
            pageTitle: action.payload
        }),
        setKnowledgePageTitle: (state, action) => ({
            ...state,
            knowledgePageTitle: action.payload
        })
    },
})

export const {
    setBreadcrumb,
    setPageTitle,
    setKnowledgePageTitle
} = adminSlice.actions

export default adminSlice.reducer
