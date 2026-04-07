import { useEffect, useState } from "react";
import { Button, Center, Dialog, Spinner, Table } from "@chakra-ui/react";
import { fetchPlaylistTracks, type Playlist } from "../../services/playlists-service.js";
import type { Track } from "../../services/albums-service.js"; // Берем тип из альбомов

interface Props {
    playlist: Playlist | null;
    onClose: () => void;
}

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
        <Dialog.Root open={!!playlist} onOpenChange={onClose}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content p="6" bg="gray.900" border="1px solid" borderColor="purple.500">
                    <Dialog.Header>
                        <Dialog.Title fontSize="xl" color="purple.300">
                            Playlist: {playlist?.name}
                        </Dialog.Title>
                    </Dialog.Header>

                    <Dialog.Body>
                        {loading ? (
                            <Center py="10"><Spinner color="purple.500" /></Center>
                        ) : (
                            <Table.Root size="sm" variant="line">
                                <Table.Body>
                                    {tracks.map((track, i) => (
                                        <Table.Row key={i}>
                                            <Table.Cell width="10%">{i + 1}</Table.Cell>
                                            <Table.Cell fontWeight="medium">{track.trackName}</Table.Cell>
                                            <Table.Cell color="gray.500" textAlign="right">
                                                {track.genreName}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
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

export default PlaylistTracksModal;