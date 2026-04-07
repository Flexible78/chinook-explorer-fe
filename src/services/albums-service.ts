import { apiClient } from "./api-client.js";

export interface Album {
    id: number;
    albumName: string;
    artistName: string;
}

export const fetchAlbums = async (): Promise<Album[]> => {
    // Наш apiClient сам подставит токен из Zustand
    const response = await apiClient.get("/albums");
    return response.data;
};
export interface Track {
    trackName: string;
    genreName: string;
    mediaTypeName: string;
}

export const fetchTracks = async (albumId: number): Promise<Track[]> => {
    // Стучимся по ID альбома, который нам прислал бэкенд
    const response = await apiClient.get(`/albums/${albumId}/tracks`);
    return response.data;
};