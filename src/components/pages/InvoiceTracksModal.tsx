import { useEffect, useState } from "react";
import { Center, Dialog, Spinner, Button } from "@chakra-ui/react";
import { fetchInvoiceTracks, type InvoiceTrack } from "../../services/customers-service.js";
import DataTable, { type DataTableColumn } from "../ui/DataTable.js";

interface Props {
    invoiceId: number | null;
    onClose: () => void;
}

const invoiceTrackColumns: DataTableColumn<InvoiceTrack>[] = [
    {
        key: "track",
        header: "Track Name",
        render: track => track.trackName ?? track.name ?? "Unknown track",
    },
    {
        key: "genre",
        header: "Genre",
        render: track => track.genreName ?? track.genre_name ?? "Unknown genre",
        cellProps: { color: "gray.400" },
    },
    {
        key: "price",
        header: "Price",
        render: track => `$${track.unitPrice ?? track.unit_price ?? "-"}`,
        headerProps: { textAlign: "right" },
        cellProps: { textAlign: "right", color: "green.400" },
    },
];

const InvoiceTracksModal = ({ invoiceId, onClose }: Props) => {
    const [tracks, setTracks] = useState<InvoiceTrack[]>([]);
    const [loadedInvoiceId, setLoadedInvoiceId] = useState<number | null>(null);

    useEffect(() => {
        if (!invoiceId) {
            return;
        }

        let cancelled = false;
        console.log(`[InvoiceTracksModal] 🟢 Fetching tracks for invoice: ${invoiceId}`);

        fetchInvoiceTracks(invoiceId)
            .then(data => {
                if (cancelled) {
                    return;
                }

                setTracks(data);
                setLoadedInvoiceId(invoiceId);
                console.log(`[InvoiceTracksModal] ✅ Loaded ${data.length} tracks`);
            })
            .catch(err => {
                if (cancelled) {
                    return;
                }

                setTracks([]);
                setLoadedInvoiceId(invoiceId);
                console.error("[InvoiceTracksModal] ❌ Error:", err);
            });

        return () => {
            cancelled = true;
        };
    }, [invoiceId]);

    const loading = invoiceId !== null && loadedInvoiceId !== invoiceId;

    return (
        <Dialog.Root open={!!invoiceId} onOpenChange={(e) => !e.open && onClose()}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content p="6" bg="gray.800" border="1px solid" borderColor="green.500" zIndex="2000">
                    <Dialog.Header>
                        <Dialog.Title fontSize="xl" color="green.300">🎶 Invoice Tracks</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        {loading ? <Center py="10"><Spinner color="green.500" /></Center> : (
                            <DataTable
                                data={tracks}
                                columns={invoiceTrackColumns}
                                getRowKey={(track) => `${track.trackName ?? track.name ?? "track"}-${track.unitPrice ?? track.unit_price ?? "price"}`}
                                tableProps={{ size: "sm" }}
                            />
                        )}
                    </Dialog.Body>
                    <Dialog.CloseTrigger asChild position="absolute" top="2" right="2">
                        <Button variant="ghost" size="sm">✕</Button>
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};

export default InvoiceTracksModal;
