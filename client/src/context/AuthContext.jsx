import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(localStorage.getItem("role") || null);


    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedRole = localStorage.getItem("role");
        const storedUser = localStorage.getItem("username");

        if (token) {
            setIsAuthenticated(true);
            setRole(storedRole);
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = (token, username, role) => {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("username", username);

        setRole(role);
        setIsAuthenticated(true);
        setUser(username);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");

        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        // 3. Pass loading in the value
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading, role }}>
            {children}
        </AuthContext.Provider>
    );
};