import { useEffect, useState } from "react";
import { Box, Spinner, Center, Heading } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../state-management/auth-store.js";
import { fetchAlbums } from "../../services/albums-service.js";
import AlbumTracksModal from "./AlbumTracksModal.js";
import DataTable, { type DataTableColumn } from "../ui/DataTable.js";

type AlbumRow = {
    id?: number;
    albumName?: string;
    artistName?: string;
    title?: string;
    album_name?: string;
    artist?: string;
};

const getAlbumTitle = (album: AlbumRow) => album.albumName ?? album.title ?? album.album_name ?? "Untitled album";
const getArtistName = (album: AlbumRow) => album.artistName ?? album.artist ?? "Unknown artist";

const albumColumns: DataTableColumn<AlbumRow>[] = [
    {
        key: "id",
        header: "ID",
        render: (album) => album.id ?? "Unknown",
        sortable: true,
        sortAccessor: (album) => album.id ?? Number.MAX_SAFE_INTEGER,
        headerProps: { width: "10%" },
    },
    {
        key: "albumName",
        header: "Album Title",
        render: (album) => getAlbumTitle(album),
        sortable: true,
        sortAccessor: (album) => getAlbumTitle(album),
        headerProps: { width: "50%" },
        cellProps: { fontWeight: "bold", color: "white" },
    },
    {
        key: "artistName",
        header: "Artist",
        render: (album) => getArtistName(album),
        sortable: true,
        sortAccessor: (album) => getArtistName(album),
        headerProps: { width: "40%" },
        cellProps: { color: "gray.400" },
    },
];

const AlbumsPage = () => {
    const role = useAuthStore(s => s.role);
    const [albums, setAlbums] = useState<AlbumRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAlbum, setSelectedAlbum] = useState<AlbumRow | null>(null);

    useEffect(() => {
        fetchAlbums()
            .then(data => { setAlbums(data as AlbumRow[]); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    // Sales users are not allowed on media pages.
    if (role !== "USER" && role !== "SUPER_USER") return <Navigate to="/customers" replace />;

    if (loading) return <Center h="100vh"><Spinner size="xl" color="purple.500" /></Center>;

    return (
        <Box p="8" maxW="1200px" mx="auto">
            <Heading size="2xl" color="purple.400" mb="8">🎸 Albums Explorer</Heading>

            <Box overflowX="auto">
                <DataTable
                    data={albums}
                    columns={albumColumns}
                    getRowKey={(album, index) => album.id ?? `album-${index}`}
                    onRowClick={setSelectedAlbum}
                    pageSize={10}
                />
            </Box>

            <AlbumTracksModal album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />
        </Box>
    );
};

export default AlbumsPage;
