// src/components/NavBar.tsx
import { Box, Flex, Button, Text, Stack } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../state-management/auth-store.js";

const NavBar = () => {
    const { role, userData, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation(); // Чтобы подсвечивать активную вкладку

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Вспомогательная функция для подсветки активной кнопки
    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <Box bg="gray.900" px={{ base: 4, md: 8 }} py={3} borderBottom="1px solid" borderColor="gray.700" mb={6}>
            <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
                {/* Логотип */}
                <Text fontSize="xl" fontWeight="bold" color="blue.400" display={{ base: "none", md: "block" }}>
                    🎸 Chinook Explorer
                </Text>

                {/* Центральное меню с проверкой ролей */}
                <Stack direction="row" gap={4}>
                    {(role === "SUPER_USER" || role === "SALE") && (
                        <Button
                            variant={isActive("/customers") ? "solid" : "ghost"}
                            colorPalette="blue"
                            onClick={() => navigate("/customers")}
                        >
                            👥 Customers
                        </Button>
                    )}

                    {(role === "SUPER_USER" || role === "USER") && (
                        <>
                            <Button
                                variant={isActive("/albums") ? "solid" : "ghost"}
                                colorPalette="purple"
                                onClick={() => navigate("/albums")}
                            >
                                💿 Albums
                            </Button>
                            <Button
                                variant={isActive("/playlists") ? "solid" : "ghost"}
                                colorPalette="purple"
                                onClick={() => navigate("/playlists")}
                            >
                                🎵 Playlists
                            </Button>
                        </>
                    )}
                </Stack>

                {/* Инфо профиля и кнопка Выхода */}
                <Stack direction="row" gap={4} align="center">
                    <Text fontSize="sm" color="gray.400" display={{ base: "none", md: "block" }}>
                        {userData?.email} ({role})
                    </Text>
                    <Button size="sm" colorPalette="red" variant="outline" onClick={handleLogout}>
                        Выйти 🚪
                    </Button>
                </Stack>
            </Flex>
        </Box>
    );
};

export default NavBar;
