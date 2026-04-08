// src/components/pages/PlaylistTracksModal.tsx
import { type Playlist } from "../../services/playlists-service.js";
import { usePlaylistTracks } from "../../hooks/queries.js";
import TracksModal from "../ui/TracksModal.js";
import { getTrackRowKey, standardTrackColumns } from "../ui/trackTableColumns.js";

interface Props {
    playlist: Playlist | null;
    onClose: () => void;
}

const PlaylistTracksModal = ({ playlist, onClose }: Props) => {
    const { data: tracks = [], isPending, error } = usePlaylistTracks(playlist?.id ?? null);

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
