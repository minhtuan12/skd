import {createSlice} from "@reduxjs/toolkit";

export interface IBreadCrumb {
    title: string;
    href?: string;
}

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        breadcrumb: [],
        pageTitle: ''
    },
    reducers: {
        setBreadcrumb: (state, action) => ({
            ...state,
            breadcrumb: action.payload
        }),
        setPageTitle: (state, action) => ({
            ...state,
            pageTitle: action.payload
        })
    },
})

export const {
    setBreadcrumb,
    setPageTitle,
} = adminSlice.actions

export default adminSlice.reducer
