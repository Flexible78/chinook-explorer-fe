// src/components/pages/PlaylistTracksModal.tsx
import { useEffect, useState } from "react";
import { Button, Center, Dialog, Spinner } from "@chakra-ui/react";
import { fetchPlaylistTracks, type Playlist } from "../../services/playlists-service.js";
import type { Track } from "../../services/albums-service.js";
import DataTable, { type DataTableColumn } from "../ui/DataTable.js";

interface Props {
    playlist: Playlist | null;
    onClose: () => void;
}

const playlistTrackColumns: DataTableColumn<Track>[] = [
    {
        key: "index",
        header: "#",
        render: (_track, index) => index + 1,
        cellProps: { width: "10%" },
    },
    {
        key: "trackName",
        header: "Track",
        accessor: "trackName",
        cellProps: { fontWeight: "medium" },
    },
    {
        key: "genreName",
        header: "Genre",
        accessor: "genreName",
        cellProps: { color: "gray.500", textAlign: "right" },
    },
];

const PlaylistTracksModal = ({ playlist, onClose }: Props) => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!playlist) return;

        setLoading(true);
        fetchPlaylistTracks(playlist.playlist_id)
            .then(setTracks)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [playlist]);

    return (
        <Dialog.Root open={!!playlist} onOpenChange={(details) => { if (!details.open) onClose(); }}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content p="6" bg="gray.900" border="1px solid" borderColor="purple.500" position="relative">
                    <Dialog.Header>
                        <Dialog.Title fontSize="xl" color="purple.300" pr="8">
                            Playlist: {playlist?.name}
                        </Dialog.Title>
                    </Dialog.Header>

                    <Dialog.Body pb="4">
                        {loading ? (
                            <Center py="10"><Spinner color="purple.500" /></Center>
                        ) : (
                            <DataTable
                                data={tracks}
                                columns={playlistTrackColumns}
                                getRowKey={(track) => `${track.trackName}-${track.genreName}`}
                                showHeader={false}
                                tableProps={{ size: "sm", variant: "line" }}
                            />
                        )}
                    </Dialog.Body>

                    {/* Close button in the top-right corner */}
                    <Dialog.CloseTrigger asChild position="absolute" top="2" right="2">
                        <Button variant="ghost" size="sm" px="2" color="gray.400" _hover={{ color: "white", bg: "red.500" }}>
                            ✕
                        </Button>
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};

export default PlaylistTracksModal;
