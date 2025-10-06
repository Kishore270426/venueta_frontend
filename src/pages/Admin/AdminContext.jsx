import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const AdminContext = createContext();

// AdminContext Provider component
export const AdminProvider = ({ children }) => {
    // Initialize state from localStorage or use default values
    const [adminData, setAdminData] = useState(() => {
        const savedData = localStorage.getItem('adminData');
        return savedData
            ? JSON.parse(savedData)
            : {
                access_token: null,
                refresh_token: null,
                token_type: null,
                user_id: null,
                admin_name: null,
            };
    });

    // Update localStorage whenever adminData changes
    useEffect(() => {
        localStorage.setItem('adminData', JSON.stringify(adminData));
    }, [adminData]);

    // Method to set the admin context (for login)
    const setAdminContext = (data) => {
        setAdminData(data);
    };

    // Method to logout (clear admin context)
    const logout = () => {
        setAdminData({
            access_token: null,
            refresh_token: null,
            token_type: null,
            user_id: null,
            admin_name: null,
        });
        localStorage.removeItem('adminData'); // Clear localStorage
    };

    return (
        <AdminContext.Provider value={{ adminData, setAdminContext, logout }}>
            {children}
        </AdminContext.Provider>
    );
};

// Custom hook to use AdminContext
export const useAdminContext = () => {
    return useContext(AdminContext);
};




