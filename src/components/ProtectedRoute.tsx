// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../state-management/auth-store.js";
import NavBar from "./NavBar.js"; // Импортируем наше новое меню

const ProtectedRoute = () => {
    const token = useAuthStore((s) => s.token);

    // Если токена нет — пинком на логин
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Если токен есть — рисуем сверху Меню, а под ним текущую страницу (Outlet)
    return (
        <>
            <NavBar />
            <Outlet />
        </>
    );
};

export default ProtectedRoute;