import { useEffect, useState } from "react";
import { Box, Spinner, Center, Heading } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../state-management/auth-store.js";
import { fetchPlaylists, type Playlist } from "../../services/playlists-service.js";
import PlaylistTracksModal from "./PlaylistTracksModal.js";
import DataTable, { type DataTableColumn } from "../ui/DataTable.js";

type PlaylistRow = {
    playlist_id?: number;
    playlistId?: number;
    id?: number;
    name?: string;
    title?: string;
};

const getPlaylistId = (playlist: PlaylistRow) => playlist.playlist_id ?? playlist.playlistId ?? playlist.id ?? null;
const getPlaylistName = (playlist: PlaylistRow) => playlist.name ?? playlist.title ?? "Untitled playlist";

const playlistColumns: DataTableColumn<PlaylistRow>[] = [
    {
        key: "playlist_id",
        header: "ID",
        render: (playlist) => getPlaylistId(playlist) ?? "Unknown",
        sortable: true,
        sortAccessor: (playlist) => getPlaylistId(playlist) ?? Number.MAX_SAFE_INTEGER,
        headerProps: { width: "20%" },
    },
    {
        key: "name",
        header: "Playlist Name",
        render: (playlist) => getPlaylistName(playlist),
        sortable: true,
        sortAccessor: (playlist) => getPlaylistName(playlist),
        headerProps: { width: "80%" },
        cellProps: { fontWeight: "bold", color: "white" },
    },
];

const PlaylistsPage = () => {
    const role = useAuthStore(s => s.role);
    const [playlists, setPlaylists] = useState<PlaylistRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistRow | null>(null);

    useEffect(() => {
        fetchPlaylists()
            .then(data => { setPlaylists(data as PlaylistRow[]); setLoading(false); })
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
                    getRowKey={(playlist, index) => getPlaylistId(playlist) ?? `playlist-${index}`}
                    onRowClick={setSelectedPlaylist}
                    pageSize={10}
                />
            </Box>

            <PlaylistTracksModal playlist={selectedPlaylist as Playlist | null} onClose={() => setSelectedPlaylist(null)} />
        </Box>
    );
};

export default PlaylistsPage;
