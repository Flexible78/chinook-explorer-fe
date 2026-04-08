import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Spinner, Center, Heading, Text } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../state-management/auth-store.js";
import { fetchAlbums, type Album } from "../../services/albums-service.js";
import AlbumTracksModal from "./AlbumTracksModal.js";
import DataTable, { type DataTableColumn } from "../ui/DataTable.js";

const albumColumns: DataTableColumn<Album>[] = [
    {
        key: "id",
        header: "ID",
        accessor: "id",
        sortable: true,
        headerProps: { width: "10%" },
    },
    {
        key: "name",
        header: "Album Title",
        accessor: "name",
        sortable: true,
        headerProps: { width: "50%" },
        cellProps: { fontWeight: "bold", color: "white" },
    },
    {
        key: "artistName",
        header: "Artist",
        accessor: "artistName",
        sortable: true,
        headerProps: { width: "40%" },
        cellProps: { color: "gray.400" },
    },
];

const AlbumsPage = () => {
    const role = useAuthStore(s => s.role);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const canViewAlbums = role === "USER" || role === "SUPER_USER";

    const { data: albums = [], isPending, error } = useQuery<Album[]>({
        queryKey: ["albums"],
        queryFn: fetchAlbums,
        enabled: canViewAlbums,
    });

    // Sales users are not allowed on media pages.
    if (!canViewAlbums) return <Navigate to="/customers" replace />;

    if (isPending) return <Center h="100vh"><Spinner size="xl" color="purple.500" /></Center>;
    if (error) return <Center h="100vh"><Text color="red.400">Failed to load albums.</Text></Center>;

    return (
        <Box p="8" maxW="1200px" mx="auto">
            <Heading size="2xl" color="purple.400" mb="8">🎸 Albums Explorer</Heading>

            <Box overflowX="auto">
                <DataTable
                    data={albums}
                    columns={albumColumns}
                    getRowKey={(album) => album.id}
                    onRowClick={setSelectedAlbum}
                    pageSize={10}
                />
            </Box>

            <AlbumTracksModal album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />
        </Box>
    );
};

export default AlbumsPage;
