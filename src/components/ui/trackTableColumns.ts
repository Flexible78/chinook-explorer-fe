import type { Track } from "../../services/albums-service.js";
import type { InvoiceTrack } from "../../services/customers-service.js";
import type { DataTableColumn } from "./DataTable.js";

const formatDuration = (ms: number) => {
    if (!ms) return "";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const formatBytes = (bytes: number) => {
    if (!bytes) return "";
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const standardTrackColumns: DataTableColumn<Track>[] = [
    {
        key: "index",
        header: "#",
        render: (_track, index) => index + 1,
        cellProps: { width: "10%" },
    },
    {
        key: "trackName",
        header: "Track",
        render: (track) => track.trackName,
        sortValue: (track) => track.trackName,
        cellProps: { fontWeight: "medium" },
    },
    {
        key: "composer",
        header: "Composer",
        render: (track) => track.composer || "Unknown",
        sortValue: (track) => track.composer || "",
        cellProps: { color: "gray.500" },
    },
    {
        key: "genreName",
        header: "Genre",
        render: (track) => track.genreName,
        sortValue: (track) => track.genreName,
        cellProps: { color: "gray.500" },
    },
    {
        key: "mediaTypeName",
        header: "Media Type",
        render: (track) => track.mediaTypeName,
        sortValue: (track) => track.mediaTypeName,
        cellProps: { color: "gray.400" },
    },
    {
        key: "milliseconds",
        header: "Duration",
        render: (track) => formatDuration(track.milliseconds),
        sortValue: (track) => track.milliseconds,
        headerProps: { textAlign: "right" },
        cellProps: { textAlign: "right", color: "gray.500" },
    },
    {
        key: "bytes",
        header: "Size",
        render: (track) => formatBytes(track.bytes),
        sortValue: (track) => track.bytes,
        headerProps: { textAlign: "right" },
        cellProps: { textAlign: "right", color: "gray.500" },
    },
    {
        key: "unitPrice",
        header: "Price",
        render: (track) => `$${track.unitPrice}`,
        sortValue: (track) => track.unitPrice,
        headerProps: { textAlign: "right" },
        cellProps: { textAlign: "right", color: "green.400" },
    },
];

export const invoiceTrackColumns: DataTableColumn<InvoiceTrack>[] = [
    {
        key: "trackName",
        header: "Track Name",
        render: (track) => track.trackName,
        sortValue: (track) => track.trackName,
    },
    {
        key: "genreName",
        header: "Genre",
        render: (track) => track.genreName,
        sortValue: (track) => track.genreName,
        cellProps: { color: "gray.400" },
    },
    {
        key: "mediaTypeName",
        header: "Media Type",
        render: (track) => track.mediaTypeName,
        sortValue: (track) => track.mediaTypeName,
        cellProps: { color: "gray.400" },
    },
    {
        key: "unitPrice",
        header: "Price",
        render: (track) => `$${track.unitPrice}`,
        sortValue: (track) => track.unitPrice,
        headerProps: { textAlign: "right" },
        cellProps: { textAlign: "right", color: "green.400" },
    },
];

export const getTrackRowKey = (track: Track, index: number) => `${track.trackName}-${track.genreName}-${index}`;

export const getInvoiceTrackRowKey = (track: InvoiceTrack, index: number) => `${track.trackName}-${track.unitPrice}-${index}`;
