import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('atlas-user');
        return saved ? JSON.parse(saved) : null;
    });

    // Fetch fresh user data on mount
    useEffect(() => {
        const fetchUser = async () => {
            if (user && (user._id || user.id)) {
                try {
                    const data = await api.getUser(user._id || user.id);
                    if (data.status === 'success' && data.data) {
                        setUser(data.data);
                        localStorage.setItem('atlas-user', JSON.stringify(data.data));
                    }
                } catch (err) {
                    console.error("Failed to refresh user data:", err);
                }
            }
        };
        fetchUser();
    }, []);

    const login = async (username, password) => {
        const data = await api.login(username, password);
        if (data.status === 'success') {
            setUser(data.user);
            localStorage.setItem('atlas-user', JSON.stringify(data.user));
        } else {
            throw new Error(data.message);
        }
    };

    const register = async (username, password, email) => {
        const data = await api.register(username, password, email);
        if (data.status === 'success') {
            setUser(data.user);
            localStorage.setItem('atlas-user', JSON.stringify(data.user));
        } else {
            throw new Error(data.message);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('atlas-user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
