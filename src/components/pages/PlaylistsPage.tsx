import { useEffect, useState } from "react";
import { Box, Spinner, Center, Heading } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../state-management/auth-store.js";
import { fetchPlaylists, type Playlist } from "../../services/playlists-service.js";
import PlaylistTracksModal from "./PlaylistTracksModal.js";
import DataTable, { type DataTableColumn } from "../ui/DataTable.js";

const playlistColumns: DataTableColumn<Playlist>[] = [
    {
        key: "playlist_id",
        header: "ID",
        accessor: "playlist_id",
        sortable: true,
        headerProps: { width: "20%" },
    },
    {
        key: "name",
        header: "Playlist Name",
        accessor: "name",
        sortable: true,
        headerProps: { width: "80%" },
        cellProps: { fontWeight: "bold" },
    },
];

const PlaylistsPage = () => {
    const role = useAuthStore(s => s.role);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

    useEffect(() => {
        fetchPlaylists()
            .then(data => { setPlaylists(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (role !== "USER" && role !== "SUPER_USER") return <Navigate to="/customers" replace />;

    if (loading) return <Center h="100vh"><Spinner size="xl" color="purple.500" /></Center>;

    return (
        <Box p="8" maxW="800px" mx="auto">
            <Heading size="2xl" color="purple.400" mb="8">🎵 Playlists</Heading>

            <Box overflowX="auto">
                <DataTable
                    data={playlists}
                    columns={playlistColumns}
                    getRowKey={(playlist) => playlist.playlist_id}
                    onRowClick={setSelectedPlaylist}
                />
            </Box>

            <PlaylistTracksModal playlist={selectedPlaylist} onClose={() => setSelectedPlaylist(null)} />
        </Box>
    );
};

export default PlaylistsPage;
