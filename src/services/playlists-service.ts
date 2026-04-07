import { apiClient } from "./api-client.js";
import type { Track } from "./albums-service.js"; // Берем тип трека из альбомов

export interface Playlist {
    playlist_id: number;
    name: string;
}

export const fetchPlaylists = async (): Promise<Playlist[]> => {
    const response = await apiClient.get("/playlists");
    return response.data;
};

export const fetchPlaylistTracks = async (playlistId: number): Promise<Track[]> => {
    const response = await apiClient.get(`/playlists/${playlistId}/tracks`);
    return response.data;
};