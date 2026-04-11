import { apiClient } from "./api-client.js";

export interface Album {
    id: number;
    name: string;
    artistName: string;
}

export const fetchAlbums = async (): Promise<Album[]> => {
    // The shared API client injects the auth token from Zustand.
    const response = await apiClient.get<Album[]>("/albums");
    return response.data;
};
export interface Track {
    trackName: string;
    genreName: string;
    mediaTypeName: string;
    composer?: string | null;
    milliseconds: number;
    bytes: number;
    unitPrice: number | string;
}

export const fetchTracks = async (albumId: number): Promise<Track[]> => {
    // Load tracks for the selected album id from the backend.
    const response = await apiClient.get(`/albums/${albumId}/tracks`);
    return response.data;
};
