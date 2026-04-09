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

const CustomerInvoicesModal = ({ customerId, onClose }: Props) => {
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
    const { data: invoices = [], isPending, error } = useQuery<Invoice[]>({
        queryKey: ["customerInvoices", customerId],
        queryFn: () => fetchCustomerInvoices(customerId as number),
        enabled: customerId !== null,
    });

    const handleDialogOpenChange = (details: { open: boolean }) => {
        if (!details.open) {
            onClose();
        }
    };

    const invoiceColumns: DataTableColumn<Invoice>[] = [
        {
            key: "id",
            header: "ID",
            render: (invoice) => invoice.invoiceId,
            sortValue: (invoice) => invoice.invoiceId,
        },
        {
            key: "date",
            header: "Date",
            render: (invoice) => new Date(invoice.invoiceDate).toLocaleDateString(),
            sortValue: (invoice) => invoice.invoiceDate,
        },
        {
            key: "total",
            header: "Total",
            render: (invoice) => `$${invoice.total}`,
            sortValue: (invoice) => invoice.total,
            cellProps: { fontWeight: "bold" },
        },
        {
            key: "actions",
            header: "",
            render: (invoice) => (
                <Button
                    size="xs"
                    colorPalette="green"
                    onClick={() => setSelectedInvoiceId(invoice.invoiceId)}
                >
                    Details
                </Button>
            ),
            headerProps: { textAlign: "right" },
            cellProps: { textAlign: "right" },
        },
    ];

    return (
        <>
            <Dialog.Root open={!!customerId} onOpenChange={handleDialogOpenChange}>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content p="6" bg="gray.900" border="1px solid" borderColor="green.500" maxW="lg">
                        <Dialog.Header>
                            <Dialog.Title fontSize="2xl" color="green.300">🧾 Customer Invoices</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            {isPending && <Center py="10"><Spinner color="green.500" /></Center>}

                            {error && (
                                <Center py="10">
                                    <Text color="red.400">Failed to load invoices.</Text>
                                </Center>
                            )}

                            {!isPending && !error && (
                                <DataTable
                                    data={invoices}
                                    columns={invoiceColumns}
                                    getRowKey={(invoice) => invoice.invoiceId}
                                    tableProps={{ size: "sm", variant: "outline" }}
                                />
                            )}
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild position="absolute" top="2" right="2">
                            <Button variant="ghost" size="sm">✕</Button>
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>

            <InvoiceTracksModal
                customerId={customerId}
                invoiceId={selectedInvoiceId}
                onClose={() => setSelectedInvoiceId(null)}
            />
        </>
    );
};

export default CustomerInvoicesModal;
