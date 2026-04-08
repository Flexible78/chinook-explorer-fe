import { useEffect, useState } from "react";
import { Button, Center, Dialog, Spinner } from "@chakra-ui/react";
import { fetchTracks, type Album, type Track } from "../../services/albums-service.js";
import DataTable, { type DataTableColumn } from "../ui/DataTable.js";

interface Props {
    album: ({ id?: number; albumName?: string; title?: string; album_name?: string } & Partial<Album>) | null;
    onClose: () => void;
}

const trackColumns: DataTableColumn<Track>[] = [
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

const AlbumTracksModal = ({ album, onClose }: Props) => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!album) return;

        if (album.id == null) {
            setTracks([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        fetchTracks(album.id)
            .then(setTracks)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [album]); // Reload tracks whenever the selected album changes.

    return (
        <Dialog.Root open={!!album} onOpenChange={onClose}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content p="6" bg="gray.900" border="1px solid" borderColor="purple.500">
                    <Dialog.Header>
                        <Dialog.Title fontSize="xl" color="purple.300">
                            {album?.albumName ?? album?.title ?? album?.album_name ?? "Album"} — Tracks
                        </Dialog.Title>
                    </Dialog.Header>

                    <Dialog.Body>
                        {loading ? (
                            <Center py="10"><Spinner color="purple.500" /></Center>
                        ) : (
                            <DataTable
                                data={tracks}
                                columns={trackColumns}
                                getRowKey={(track, index) => `${track.trackName}-${track.genreName}-${index}`}
                                showHeader={false}
                                tableProps={{ size: "sm", variant: "line" }}
                            />
                        )}
                    </Dialog.Body>

                    <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                            <Button variant="ghost" onClick={onClose}>Close</Button>
                        </Dialog.ActionTrigger>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};

export default AlbumTracksModal;
