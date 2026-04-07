import { useEffect, useState, useMemo } from "react";
import { Box, Table, Spinner, Center, Heading } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../state-management/auth-store.js";
import { fetchPlaylists, type Playlist } from "../../services/playlists-service.js";
import PlaylistTracksModal from "./PlaylistTracksModal.js";

type SortConfig = { key: keyof Playlist; direction: "asc" | "desc" } | null;

const PlaylistsPage = () => {
    const role = useAuthStore(s => s.role);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);

    useEffect(() => {
        fetchPlaylists()
            .then(data => { setPlaylists(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (role !== "USER" && role !== "SUPER_USER") return <Navigate to="/customers" replace />;

    const sortedPlaylists = useMemo(() => {
        if (!sortConfig) return playlists;
        return [...playlists].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [playlists, sortConfig]);

    const handleSort = (key: keyof Playlist) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    if (loading) return <Center h="100vh"><Spinner size="xl" color="purple.500" /></Center>;

    return (
        <Box p="8" maxW="800px" mx="auto">
            <Heading size="2xl" color="purple.400" mb="8">🎵 Playlists</Heading>

            <Box overflowX="auto">
                <Table.Root variant="outline" stickyHeader interactive>
                    <Table.Header>
                        <Table.Row bg="bg.muted">
                            <Table.ColumnHeader width="20%" cursor="pointer" onClick={() => handleSort("playlist_id")}>
                                ID {sortConfig?.key === "playlist_id" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                            </Table.ColumnHeader>
                            <Table.ColumnHeader width="80%" cursor="pointer" onClick={() => handleSort("name")}>
                                Playlist Name {sortConfig?.key === "name" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {sortedPlaylists.map((pl) => (
                            <Table.Row
                                key={pl.playlist_id}
                                cursor="pointer"
                                _hover={{ bg: "whiteAlpha.100" }}
                                onClick={() => setSelectedPlaylist(pl)}
                            >
                                <Table.Cell>{pl.playlist_id}</Table.Cell>
                                <Table.Cell fontWeight="bold">{pl.name}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Box>

            <PlaylistTracksModal playlist={selectedPlaylist} onClose={() => setSelectedPlaylist(null)} />
        </Box>
    );
};

export default PlaylistsPage;