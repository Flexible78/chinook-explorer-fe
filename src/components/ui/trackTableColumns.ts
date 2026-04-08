import type { Track } from "../../services/albums-service.js";
import type { InvoiceTrack } from "../../services/customers-service.js";
import type { DataTableColumn } from "./DataTable.js";

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
        accessor: "trackName",
        cellProps: { fontWeight: "medium" },
    },
    {
        key: "genreName",
        header: "Genre",
        accessor: "genreName",
        cellProps: { color: "gray.500" },
    },
    {
        key: "mediaTypeName",
        header: "Media Type",
        accessor: "mediaTypeName",
        cellProps: { color: "gray.400", textAlign: "right" },
    },
];

export const invoiceTrackColumns: DataTableColumn<InvoiceTrack>[] = [
    {
        key: "trackName",
        header: "Track Name",
        accessor: "trackName",
    },
    {
        key: "genreName",
        header: "Genre",
        accessor: "genreName",
        cellProps: { color: "gray.400" },
    },
    {
        key: "mediaTypeName",
        header: "Media Type",
        accessor: "mediaTypeName",
        cellProps: { color: "gray.400" },
    },
    {
        key: "unitPrice",
        header: "Price",
        render: (track) => `$${track.unitPrice}`,
        headerProps: { textAlign: "right" },
        cellProps: { textAlign: "right", color: "green.400" },
    },
];

export const getTrackRowKey = (track: Track, index: number) => `${track.trackName}-${track.genreName}-${index}`;

export const getInvoiceTrackRowKey = (track: InvoiceTrack, index: number) => `${track.trackName}-${track.unitPrice}-${index}`;
