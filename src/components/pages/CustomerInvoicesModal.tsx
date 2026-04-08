import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Center, Dialog, Spinner, Button, Text } from "@chakra-ui/react";
import { fetchCustomerInvoices, type Invoice } from "../../services/customers-service.js";
import InvoiceTracksModal from "./InvoiceTracksModal.js";
import DataTable, { type DataTableColumn } from "../ui/DataTable.js";

interface Props {
    customerId: number | null;
    onClose: () => void;
}

const formatInvoiceDate = (invoice: Invoice) => new Date(invoice.invoiceDate).toLocaleDateString();
const formatInvoiceTotal = (invoice: Invoice) => `$${invoice.total}`;

const renderInvoicesErrorState = () => (
    <Center py="10">
        <Text color="red.400">Failed to load invoices.</Text>
    </Center>
);

const renderInvoiceActions = (
    invoice: Invoice,
    onOpenInvoiceTracks: (invoiceId: number) => void,
) => {
    const handleDetailsClick = () => {
        onOpenInvoiceTracks(invoice.invoiceId);
    };

    return (
        <Button
            size="xs"
            colorPalette="green"
            onClick={handleDetailsClick}
        >
            Details
        </Button>
    );
};

const CustomerInvoicesModal = ({ customerId, onClose }: Props) => {
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
    const { data: invoices = [], isPending, error } = useQuery<Invoice[]>({
        queryKey: ["customers", customerId, "invoices"],
        queryFn: () => fetchCustomerInvoices(customerId as number),
        enabled: customerId !== null,
    });

    const handleDialogOpenChange = (details: { open: boolean }) => {
        if (!details.open) {
            onClose();
        }
    };

    const handleInvoiceTracksOpen = (invoiceId: number) => {
        setSelectedInvoiceId(invoiceId);
    };

    const handleInvoiceTracksClose = () => {
        setSelectedInvoiceId(null);
    };

    const invoiceColumns: DataTableColumn<Invoice>[] = [
        {
            key: "id",
            header: "ID",
            accessor: "invoiceId",
        },
        {
            key: "date",
            header: "Date",
            render: formatInvoiceDate,
        },
        {
            key: "total",
            header: "Total",
            render: formatInvoiceTotal,
            cellProps: { fontWeight: "bold" },
        },
        {
            key: "actions",
            header: "",
            render: invoice => renderInvoiceActions(invoice, handleInvoiceTracksOpen),
            headerProps: { textAlign: "right" },
            cellProps: { textAlign: "right" },
        },
    ];

    const renderInvoicesContent = () => {
        if (isPending) {
            return <Center py="10"><Spinner color="green.500" /></Center>;
        }

        if (error) {
            return renderInvoicesErrorState();
        }

        return (
            <DataTable
                data={invoices}
                columns={invoiceColumns}
                getRowKey={(invoice) => invoice.invoiceId}
                tableProps={{ size: "sm", variant: "outline" }}
            />
        );
    };

    return (
        <>
            <Dialog.Root open={!!customerId} onOpenChange={handleDialogOpenChange}>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content p="6" bg="gray.900" border="1px solid" borderColor="green.500" maxW="lg">
                        <Dialog.Header>
                            <Dialog.Title fontSize="2xl" color="green.300">🧾 Customer Invoices</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>{renderInvoicesContent()}</Dialog.Body>
                        <Dialog.CloseTrigger asChild position="absolute" top="2" right="2">
                            <Button variant="ghost" size="sm">✕</Button>
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>

            <InvoiceTracksModal invoiceId={selectedInvoiceId} onClose={handleInvoiceTracksClose} />
        </>
    );
};

export default CustomerInvoicesModal;
