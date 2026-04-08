// src/components/pages/PlaylistTracksModal.tsx
import { useQuery } from "@tanstack/react-query";
import type { Track } from "../../services/albums-service.js";
import { fetchPlaylistTracks, type Playlist } from "../../services/playlists-service.js";
import TracksModal from "../ui/TracksModal.js";
import { getTrackRowKey, standardTrackColumns } from "../ui/trackTableColumns.js";

interface Props {
    playlist: Playlist | null;
    onClose: () => void;
}

const PlaylistTracksModal = ({ playlist, onClose }: Props) => {
    const playlistId = playlist?.id;
    const { data: tracks = [], isPending, error } = useQuery<Track[]>({
        queryKey: ["playlists", playlistId, "tracks"],
        queryFn: () => fetchPlaylistTracks(playlistId as number),
        enabled: playlistId !== undefined,
    });

    return (
        <TracksModal
            isOpen={playlist !== null}
            onClose={onClose}
            title={playlist ? `Playlist: ${playlist.name}` : "Playlist Tracks"}
            tracks={tracks}
            loading={isPending}
            columns={standardTrackColumns}
            getRowKey={getTrackRowKey}
            spinnerColor="purple.500"
            errorMessage={error ? "Failed to load playlist tracks." : null}
            tableProps={{ size: "sm", variant: "line" }}
            contentProps={{ bg: "gray.900", border: "1px solid", borderColor: "purple.500" }}
            titleProps={{ color: "purple.300" }}
            pageSize={10}
        />
    );
};

export default PlaylistTracksModal;
