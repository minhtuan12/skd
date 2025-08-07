'use client';

import React, {createContext, ReactNode, useContext} from 'react';
import {IAdmin} from "@/models/admin";
import {useMe} from "@/app/admin/(auth)/(hooks)/use-me";
import {QueryObserverResult} from "@tanstack/react-query";

interface AdminContextType {
    admin: IAdmin | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<QueryObserverResult<IAdmin, Error>>;
    logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
    children: ReactNode;
}

export const AdminProvider = ({children}: AdminProviderProps) => {
    const {admin, loading, error, refetch, logout} = useMe();

    const value: AdminContextType = {
        admin,
        loading,
        error,
        refetch,
        logout,
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = (): AdminContextType => {
    const context = useContext(AdminContext);

    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }

    return context;
};

export const useAuth = () => {
    const {admin, loading} = useAdmin();

    return {
        isAuthenticated: !!admin,
        isLoading: loading,
        admin,
    };
};
