// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../state-management/auth-store.js";

const ProtectedRoute = () => {
    const token = useAuthStore((s) => s.token);

    // Если токена нет — отправляем на логин.
    // Если есть — показываем то, что внутри (Outlet)
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;