import { useEffect, useState, useMemo } from "react";
import { Box, Table, Spinner, Center, Heading } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../state-management/auth-store.js";
import { fetchAlbums, type Album } from "../../services/albums-service.js";
import AlbumTracksModal from "./AlbumTracksModal.js";

type SortConfig = { key: keyof Album; direction: "asc" | "desc" } | null;

const AlbumsPage = () => {
    const role = useAuthStore(s => s.role);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);

    useEffect(() => {
        fetchAlbums()
            .then(data => { setAlbums(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    // Sales users are not allowed on media pages.
    if (role !== "USER" && role !== "SUPER_USER") return <Navigate to="/customers" replace />;

    // Apply client-side column sorting.
    const sortedAlbums = useMemo(() => {
        if (!sortConfig) return albums;
        return [...albums].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [albums, sortConfig]);

    const handleSort = (key: keyof Album) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    if (loading) return <Center h="100vh"><Spinner size="xl" color="purple.500" /></Center>;

    return (
        <Box p="8" maxW="1200px" mx="auto">
            <Heading size="2xl" color="purple.400" mb="8">🎸 Albums Explorer</Heading>

            <Box overflowX="auto">
                <Table.Root variant="outline" stickyHeader interactive>
                    <Table.Header>
                        <Table.Row bg="bg.muted">
                            <Table.ColumnHeader width="10%" cursor="pointer" onClick={() => handleSort("id")}>
                                ID {sortConfig?.key === "id" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                            </Table.ColumnHeader>
                            <Table.ColumnHeader width="50%" cursor="pointer" onClick={() => handleSort("albumName")}>
                                Album Title {sortConfig?.key === "albumName" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                            </Table.ColumnHeader>
                            <Table.ColumnHeader width="40%" cursor="pointer" onClick={() => handleSort("artistName")}>
                                Artist {sortConfig?.key === "artistName" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {sortedAlbums.map((album) => (
                            <Table.Row
                                key={album.id}
                                onClick={() => setSelectedAlbum(album)}
                                cursor="pointer"
                            >
                                <Table.Cell>{album.id}</Table.Cell>
                                <Table.Cell fontWeight="bold">{album.albumName}</Table.Cell>
                                <Table.Cell color="gray.400">{album.artistName}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Box>

            <AlbumTracksModal album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />
        </Box>
    );
};

export default AlbumsPage;
