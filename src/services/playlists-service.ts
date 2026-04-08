import { apiClient } from "./api-client.js";
import type { Track } from "./albums-service.js";

export interface Playlist {
    id: number;
    name: string;
}

export const fetchPlaylists = async (): Promise<Playlist[]> => {
    const response = await apiClient.get<Playlist[]>("/playlists");
    return response.data;
};

export const fetchPlaylistTracks = async (playlistId: number): Promise<Track[]> => {
    const response = await apiClient.get<Track[]>(`/playlists/${playlistId}/tracks`);
    return response.data;
};
