'use client'

import React from "react";

export type ButtonHandlers = {
    reset: () => void;
    submit: () => void;
};

export const AdminButtonContext = React.createContext<{
    setHandlers: (h: ButtonHandlers) => void;
    setLoading: (loading: boolean) => void;
}>({
    setHandlers: () => {},
    setLoading: () => {},
});
