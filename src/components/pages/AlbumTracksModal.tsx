import { fetchTracks, type Album } from "../../services/albums-service.js";
import TrackCollectionModal from "./TrackCollectionModal.js";

interface Props {
    album: Album | null;
    onClose: () => void;
}

const AlbumTracksModal = ({ album, onClose }: Props) => {
    return (
        <TrackCollectionModal<Album>
            entity={album}
            onClose={onClose}
            queryKeyBase="albumTracks"
            queryFn={fetchTracks}
            fallbackTitle="Album Tracks"
            makeTitle={(selectedAlbum) => `${selectedAlbum.name} — Tracks`}
            errorMessage="Failed to load album tracks."
        />
    );
};

export default AlbumTracksModal;
