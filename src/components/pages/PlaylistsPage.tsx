import { useEffect, useState } from "react";
import { Box, Table, Spinner, Center, Heading } from "@chakra-ui/react";
import { fetchPlaylists, type Playlist } from "../../services/playlists-service.js";
import PlaylistTracksModal from "./PlaylistTracksModal.js"; // 1. Импортируем модалку

const PlaylistsPage = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);

    // 2. Стейт для того, по какому плейлисту кликнули
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

    useEffect(() => {
        fetchPlaylists()
            .then(data => { setPlaylists(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <Center h="100vh"><Spinner size="xl" color="purple.500" /></Center>;

    return (
        <Box p="8" maxW="800px" mx="auto">
            <Heading size="2xl" color="purple.400" mb="8">🎵 Playlists</Heading>

            <Table.Root variant="outline" stickyHeader interactive>
                <Table.Header>
                    <Table.Row bg="bg.muted">
                        <Table.ColumnHeader width="20%">ID</Table.ColumnHeader>
                        <Table.ColumnHeader width="80%">Playlist Name</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {playlists.map((pl) => (
                        <Table.Row
                            key={pl.playlist_id}
                            cursor="pointer"
                            _hover={{ bg: "whiteAlpha.100" }}
                            onClick={() => setSelectedPlaylist(pl)} // 3. Вешаем клик
                        >
                            <Table.Cell>{pl.playlist_id}</Table.Cell>
                            <Table.Cell fontWeight="bold">{pl.name}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>

            {/* 4. Рисуем модалку */}
            <PlaylistTracksModal
                playlist={selectedPlaylist}
                onClose={() => setSelectedPlaylist(null)}
            />
        </Box>
    );
};

export default PlaylistsPage;