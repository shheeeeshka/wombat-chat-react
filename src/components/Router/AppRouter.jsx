import { Navigate, Route, Routes } from "react-router-dom";

import ChatPage from "../../pages/Chat/ChatPage";
import AuthPage from "../../pages/Auth/AuthPage";
import Layout from "../Layout/Layout";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const AppRouter = () => {
    const { user } = useContext(AuthContext);

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={user ? <ChatPage /> : <Navigate to="auth" />} />
                <Route path="/auth" element={user ? <ChatPage /> : <AuthPage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Route>
        </Routes>
    );
}

export default AppRouter;