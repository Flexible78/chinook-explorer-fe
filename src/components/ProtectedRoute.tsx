// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../state-management/auth-store.js";
import NavBar from "./NavBar.js";

const ProtectedRoute = () => {
    const token = useAuthStore((s) => s.token);

    // Redirect unauthenticated users to the login page.
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Render the shared navigation above the active protected page.
    return (
        <>
            <NavBar />
            <Outlet />
        </>
    );
};

export default ProtectedRoute;
