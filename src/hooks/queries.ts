import { useQuery } from "@tanstack/react-query";
import { fetchAlbums, fetchTracks, type Album, type Track } from "../services/albums-service.js";
import {
    fetchCustomerInvoices,
    fetchCustomers,
    fetchInvoiceTracks,
    fetchSalesAgent,
    type Customer,
    type Invoice,
    type InvoiceTrack,
    type SalesAgent,
} from "../services/customers-service.js";
import { fetchPlaylists, fetchPlaylistTracks, type Playlist } from "../services/playlists-service.js";

const queryKeys = {
    albums: ["albums"] as const,
    albumTracks: (albumId: number) => ["albums", albumId, "tracks"] as const,
    customers: ["customers"] as const,
    customerInvoices: (customerId: number) => ["customers", customerId, "invoices"] as const,
    salesAgent: (customerId: number) => ["customers", customerId, "agent"] as const,
    playlists: ["playlists"] as const,
    playlistTracks: (playlistId: number) => ["playlists", playlistId, "tracks"] as const,
    invoiceTracks: (invoiceId: number) => ["invoices", invoiceId, "tracks"] as const,
};

export const useAlbums = () => useQuery<Album[]>({
    queryKey: queryKeys.albums,
    queryFn: fetchAlbums,
});

export const useAlbumTracks = (albumId: number | null) => useQuery<Track[]>({
    queryKey: albumId == null ? ["albums", "tracks", "disabled"] : queryKeys.albumTracks(albumId),
    queryFn: () => fetchTracks(albumId as number),
    enabled: albumId !== null,
});

export const useCustomers = () => useQuery<Customer[]>({
    queryKey: queryKeys.customers,
    queryFn: fetchCustomers,
});

export const useCustomerInvoices = (customerId: number | null) => useQuery<Invoice[]>({
    queryKey: customerId == null ? ["customers", "invoices", "disabled"] : queryKeys.customerInvoices(customerId),
    queryFn: () => fetchCustomerInvoices(customerId as number),
    enabled: customerId !== null,
});

export const useSalesAgent = (customerId: number | null) => useQuery<SalesAgent>({
    queryKey: customerId == null ? ["customers", "agent", "disabled"] : queryKeys.salesAgent(customerId),
    queryFn: () => fetchSalesAgent(customerId as number),
    enabled: customerId !== null,
});

export const usePlaylists = () => useQuery<Playlist[]>({
    queryKey: queryKeys.playlists,
    queryFn: fetchPlaylists,
});

export const usePlaylistTracks = (playlistId: number | null) => useQuery<Track[]>({
    queryKey: playlistId == null ? ["playlists", "tracks", "disabled"] : queryKeys.playlistTracks(playlistId),
    queryFn: () => fetchPlaylistTracks(playlistId as number),
    enabled: playlistId !== null,
});

export const useInvoiceTracks = (invoiceId: number | null) => useQuery<InvoiceTrack[]>({
    queryKey: invoiceId == null ? ["invoices", "tracks", "disabled"] : queryKeys.invoiceTracks(invoiceId),
    queryFn: () => fetchInvoiceTracks(invoiceId as number),
    enabled: invoiceId !== null,
});
