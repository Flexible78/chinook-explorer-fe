import { fetchPlaylistTracks, type Playlist } from "../../services/playlists-service.js";
import TrackCollectionModal from "./TrackCollectionModal.js";

interface Props {
    playlist: Playlist | null;
    onClose: () => void;
}

const PlaylistTracksModal = ({ playlist, onClose }: Props) => {
    return (
        <TrackCollectionModal<Playlist>
            entity={playlist}
            onClose={onClose}
            queryKeyBase="playlistTracks"
            queryFn={fetchPlaylistTracks}
            fallbackTitle="Playlist Tracks"
            makeTitle={(selectedPlaylist) => `Playlist: ${selectedPlaylist.name}`}
            errorMessage="Failed to load playlist tracks."
            pageSize={10}
        />
    );
};

export default PlaylistTracksModal;
