import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Spinner, Center, Heading, Text } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../state-management/auth-store.js";
import { fetchPlaylists, type Playlist } from "../../services/playlists-service.js";
import PlaylistTracksModal from "./PlaylistTracksModal.js";
import DataTable, { type DataTableColumn } from "../ui/DataTable.js";

const playlistColumns: DataTableColumn<Playlist>[] = [
    {
        key: "id",
        header: "ID",
        accessor: "id",
        sortable: true,
        headerProps: { width: "20%" },
    },
    {
        key: "name",
        header: "Playlist Name",
        accessor: "name",
        sortable: true,
        headerProps: { width: "80%" },
        cellProps: { fontWeight: "bold", color: "white" },
    },
];

const PlaylistsPage = () => {
    const role = useAuthStore(s => s.role);
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
    const canViewPlaylists = role === "USER" || role === "SUPER_USER";

    const { data: playlists = [], isPending, error } = useQuery<Playlist[]>({
        queryKey: ["playlists"],
        queryFn: fetchPlaylists,
        enabled: canViewPlaylists,
    });

    if (!canViewPlaylists) return <Navigate to="/customers" replace />;

    if (isPending) return <Center h="100vh"><Spinner size="xl" color="purple.500" /></Center>;
    if (error) return <Center h="100vh"><Text color="red.400">Failed to load playlists.</Text></Center>;

    return (
        <Box p="8" maxW="800px" mx="auto">
            <Heading size="2xl" color="purple.400" mb="8">🎵 Playlists</Heading>

            <Box overflowX="auto">
                <DataTable
                    data={playlists}
                    columns={playlistColumns}
                    getRowKey={(playlist) => playlist.id}
                    onRowClick={setSelectedPlaylist}
                    pageSize={10}
                />
            </Box>

            <PlaylistTracksModal playlist={selectedPlaylist} onClose={() => setSelectedPlaylist(null)} />
        </Box>
    );
};

export default PlaylistsPage;
