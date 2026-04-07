import { useEffect, useState } from "react";
import { Center, Dialog, Spinner, Table, Button } from "@chakra-ui/react";
import { fetchInvoiceTracks } from "../../services/customers-service.js";
import type { Track } from "../../services/albums-service.js";

interface Props {
    invoiceId: number | null;
    onClose: () => void;
}

type InvoiceTrackRow = Track & {
    name?: string;
    genre_name?: string;
    unitPrice?: number;
    unit_price?: number;
};

const InvoiceTracksModal = ({ invoiceId, onClose }: Props) => {
    const [tracks, setTracks] = useState<InvoiceTrackRow[]>([]);
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

                setTracks(data as InvoiceTrackRow[]);
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
                            <Table.Root size="sm">
                                <Table.Header><Table.Row>
                                    <Table.ColumnHeader>Track Name</Table.ColumnHeader>
                                    <Table.ColumnHeader>Genre</Table.ColumnHeader>
                                    <Table.ColumnHeader textAlign="right">Price</Table.ColumnHeader>
                                </Table.Row></Table.Header>
                                <Table.Body>
                                    {tracks.map((t, i) => (
                                        <Table.Row key={`${t.trackName ?? t.name ?? "track"}-${i}`}>
                                            <Table.Cell>{t.trackName ?? t.name ?? "Unknown track"}</Table.Cell>
                                            <Table.Cell color="gray.400">{t.genreName ?? t.genre_name ?? "Unknown genre"}</Table.Cell>
                                            <Table.Cell textAlign="right" color="green.400">${t.unitPrice ?? t.unit_price ?? "-"}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
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
