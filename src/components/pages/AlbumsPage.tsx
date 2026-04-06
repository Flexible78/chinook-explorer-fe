import { useEffect, useState } from "react";
import { Box, Table, Spinner, Center, Heading, Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // Добавили для редиректа
import { useAuthStore } from "../../state-management/auth-store.js"; // Наш стор
import { fetchAlbums } from "../../services/albums-service.js";
import type { Album } from "../../services/albums-service.js";

const AlbumsPage = () => {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const logout = useAuthStore(s => s.logout); // Достаем функцию выхода

    useEffect(() => {
        fetchAlbums()
            .then(data => {
                setAlbums(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Ошибка:", err);
                setLoading(false);
            });
    }, []);

    // Функция для выхода
    const handleLogout = () => {
        logout(); // 1. Стираем токен в Zustand
        navigate("/login"); // 2. Кидаем пользователя на логин
    };

    if (loading) return <Center h="100vh"><Spinner size="xl" color="purple.500" /></Center>;

    return (
        <Box p="8" maxW="1200px" mx="auto">
            {/* Добавляем шапку с кнопкой выхода */}
            <Flex justify="space-between" align="center" mb="8">
                <Heading size="2xl" color="purple.400">🎸 Albums Explorer</Heading>
                <Button colorScheme="red" variant="outline" onClick={handleLogout}>
                    Выйти 🚪
                </Button>
            </Flex>

            <Table.Root variant="outline" stickyHeader interactive>
                <Table.Header>
                    <Table.Row bg="bg.muted">
                        <Table.ColumnHeader width="10%">ID</Table.ColumnHeader>
                        <Table.ColumnHeader width="50%">Album Title</Table.ColumnHeader>
                        <Table.ColumnHeader width="40%">Artist</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {albums.map((album) => (
                        <Table.Row key={album.id}>
                            <Table.Cell>{album.id}</Table.Cell>
                            <Table.Cell fontWeight="bold">{album.albumName}</Table.Cell>
                            <Table.Cell color="gray.400">{album.artistName}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Box>
    );
};

export default AlbumsPage;