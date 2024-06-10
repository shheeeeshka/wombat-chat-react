import { createContext, useCallback, useEffect, useState } from "react";
import AuthService from "../services/AuthService";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [authInfo, setAuthInfo] = useState({
        name: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        const user = localStorage.getItem("user");

        setUser(JSON.parse(user));
    }, []);

    const updateAuthInfo = useCallback((info) => {
        setAuthInfo(info);
        console.log(authInfo);
    }, [authInfo]);

    const registerUser = useCallback((e) => {
        e.preventDefault();
        setIsAuthLoading(true);
        AuthService.register(authInfo).then(response => {
            setUser(response.data.user);
            console.log(response.data);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("token", JSON.stringify(response.data.token)); // empty token!
        }).catch(err => {
            setAuthError(err.response.data.message);
            console.log(err.response);
        }).finally(() => setIsAuthLoading(false));
    }, [authInfo]);

    const loginUser = useCallback(() => {
        setIsAuthLoading(true);
        AuthService.login(authInfo).then(response => {
            setUser(response.data.user);
            console.log(response.data);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("token", JSON.stringify(response.data.token));
        }).catch(err => {
            setAuthError(err.response.data.message);
            console.log(err.response);
        }).finally(() => setIsAuthLoading(false));
    }, [authInfo]);

    const logoutUser = useCallback((e) => {
        e.preventDefault();
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
    }, []);

    return <AuthContext.Provider
        value={{
            user,
            authInfo,
            updateAuthInfo,
            registerUser,
            loginUser,
            logoutUser,
            isAuthLoading,
            authError,
        }}
    >
        {children}
    </AuthContext.Provider>
}