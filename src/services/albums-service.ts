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