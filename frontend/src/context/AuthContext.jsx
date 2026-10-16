import { createContext, useContext, useState } from "react";
import AxiosInstance from "../components/Axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    const login = async (username, password) => {
        const res = await AxiosInstance.post("api/token/", {
            username,
            password,
        });
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{ token, isAuthenticated: !!token, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
