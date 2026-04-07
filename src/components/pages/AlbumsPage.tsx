// src/components/pages/AlbumsPage.tsx
import { useEffect, useState } from "react";
import { Box, Table, Spinner, Center, Heading, Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../state-management/auth-store.js";
import { fetchAlbums, type Album } from "../../services/albums-service.js";
import AlbumTracksModal from "./AlbumTracksModal.js"; // Наш новый компонент

const AlbumsPage = () => {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

    const navigate = useNavigate();
    const logout = useAuthStore(s => s.logout);

    useEffect(() => {
        fetchAlbums()
            .then(data => { setAlbums(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <Center h="100vh"><Spinner size="xl" color="purple.500" /></Center>;

    return (
        <Box p="8" maxW="1200px" mx="auto">
            <Flex justify="space-between" align="center" mb="8">
                <Heading size="2xl" color="purple.400">🎸 Albums Explorer</Heading>
                <Button colorPalette="red" variant="outline" onClick={() => { logout(); navigate("/login"); }}>
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
                        <Table.Row
                            key={album.id}
                            onClick={() => setSelectedAlbum(album)} // Просто запоминаем альбом
                            cursor="pointer"
                        >
                            <Table.Cell>{album.id}</Table.Cell>
                            <Table.Cell fontWeight="bold">{album.albumName}</Table.Cell>
                            <Table.Cell color="gray.400">{album.artistName}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>

            {/* Модалка теперь живет своей жизнью */}
            <AlbumTracksModal
                album={selectedAlbum}
                onClose={() => setSelectedAlbum(null)}
            />
        </Box>
    );
};

export default AlbumsPage;