import { type Album } from "../../services/albums-service.js";
import { useAlbumTracks } from "../../hooks/queries.js";
import TracksModal from "../ui/TracksModal.js";
import { getTrackRowKey, standardTrackColumns } from "../ui/trackTableColumns.js";

interface Props {
    album: Album | null;
    onClose: () => void;
}

const AlbumTracksModal = ({ album, onClose }: Props) => {
    const { data: tracks = [], isPending, error } = useAlbumTracks(album?.id ?? null);

    return (
        <TracksModal
            isOpen={album !== null}
            onClose={onClose}
            title={album ? `${album.name} — Tracks` : "Album Tracks"}
            tracks={tracks}
            loading={isPending}
            columns={standardTrackColumns}
            getRowKey={getTrackRowKey}
            spinnerColor="purple.500"
            errorMessage={error ? "Failed to load album tracks." : null}
            tableProps={{ size: "sm", variant: "line" }}
            contentProps={{ bg: "gray.900", border: "1px solid", borderColor: "purple.500" }}
            titleProps={{ color: "purple.300" }}
        />
    );
};

export default AlbumTracksModal;
