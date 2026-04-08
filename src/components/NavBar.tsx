// src/components/NavBar.tsx
import { Box, Flex, Button, Text, Stack } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../state-management/auth-store.js";

const NavBar = () => {
    const { role, email, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Highlight the active navigation item.
    const isActive = (path: string) => location.pathname.startsWith(path);
    const canViewCustomers = role === "SUPER_USER" || role === "SALE";
    const canViewMedia = role === "SUPER_USER" || role === "USER";

    return (
        <Box bg="gray.900" px={{ base: 4, md: 8 }} py={3} borderBottom="1px solid" borderColor="gray.700" mb={6}>
            <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
                {/* Brand */}
                <Text fontSize="xl" fontWeight="bold" color="blue.400" display={{ base: "none", md: "block" }}>
                    🎸 Chinook Explorer
                </Text>

                {/* Main navigation with role checks */}
                <Stack direction="row" gap={4}>
                    {canViewCustomers && (
                        <Button
                            variant={isActive("/customers") ? "solid" : "ghost"}
                            colorPalette="blue"
                            onClick={() => navigate("/customers")}
                        >
                            👥 Customers
                        </Button>
                    )}

                    {canViewMedia && (
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

                {/* Profile info and logout action */}
                <Stack direction="row" gap={4} align="center">
                    <Text fontSize="sm" color="gray.400" display={{ base: "none", md: "block" }}>
                        {email} ({role})
                    </Text>
                    <Button size="sm" colorPalette="red" variant="outline" onClick={handleLogout}>
                        Logout 🚪
                    </Button>
                </Stack>
            </Flex>
        </Box>
    );
};

export default NavBar;
