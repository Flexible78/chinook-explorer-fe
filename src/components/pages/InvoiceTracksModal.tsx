import { useQuery } from "@tanstack/react-query";
import { fetchInvoiceTracks, type InvoiceTrack } from "../../services/customers-service.js";
import TracksModal from "../ui/TracksModal.js";
import { getInvoiceTrackRowKey, invoiceTrackColumns } from "../ui/trackTableColumns.js";

interface Props {
    customerId: number | null;
    invoiceId: number | null;
    onClose: () => void;
}

const InvoiceTracksModal = ({ customerId, invoiceId, onClose }: Props) => {
    const { data: tracks = [], isPending, error } = useQuery<InvoiceTrack[]>({
        queryKey: ["invoiceTracks", customerId, invoiceId],
        queryFn: () => fetchInvoiceTracks(customerId as number, invoiceId as number),
        enabled: customerId !== null && invoiceId !== null,
    });

    return (
        <TracksModal<InvoiceTrack>
            isOpen={customerId !== null && invoiceId !== null}
            onClose={onClose}
            title="🎶 Invoice Tracks"
            tracks={tracks}
            loading={isPending}
            columns={invoiceTrackColumns}
            getRowKey={getInvoiceTrackRowKey}
            spinnerColor="green.500"
            errorMessage={error ? "Failed to load invoice tracks." : null}
            tableProps={{ size: "sm" }}
            contentProps={{ bg: "gray.800", border: "1px solid", borderColor: "green.500", zIndex: "2000" }}
            titleProps={{ color: "green.300" }}
        />
    );
};

export default InvoiceTracksModal;
