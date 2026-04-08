import { apiClient } from "./api-client.js";

export interface Album {
    id: number;
    albumName: string;
    artistName: string;
}

interface RawAlbum {
    id: number;
    name: string;
    artistName: string;
}

export const fetchAlbums = async (): Promise<Album[]> => {
    // The shared API client injects the auth token from Zustand.
    const response = await apiClient.get<RawAlbum[]>("/albums");

    return response.data.map((album) => ({
        id: album.id,
        albumName: album.name,
        artistName: album.artistName,
    }));
};
export interface Track {
    trackName: string;
    genreName: string;
    mediaTypeName: string;
}

export const fetchTracks = async (albumId: number): Promise<Track[]> => {
    // Load tracks for the selected album id from the backend.
    const response = await apiClient.get(`/albums/${albumId}/tracks`);
    return response.data;
};
