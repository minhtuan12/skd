import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    policies: {}
}

const policySlice = createSlice({
    name: 'policy',
    initialState,
    reducers: {
        setPolicies: (state, action) => ({
            ...state,
            policies: action.payload,
        })
    },
})

export const {
    setPolicies,
} = policySlice.actions

export default policySlice.reducer
