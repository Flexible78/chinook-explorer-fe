import { apiClient } from "./api-client.js";
import type { Track } from "./albums-service.js";

export interface Playlist {
    playlist_id: number;
    name: string;
}

interface RawPlaylist {
    id: number;
    name: string;
}

export const fetchPlaylists = async (): Promise<Playlist[]> => {
    const response = await apiClient.get<RawPlaylist[]>("/playlists");

    return response.data.map((playlist) => ({
        playlist_id: playlist.id,
        name: playlist.name,
    }));
};

export const fetchPlaylistTracks = async (playlistId: number): Promise<Track[]> => {
    const response = await apiClient.get(`/playlists/${playlistId}/tracks`);
    return response.data;
};
