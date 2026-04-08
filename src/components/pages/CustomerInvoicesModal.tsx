import { useEffect, useState } from "react";
import { Center, Dialog, Spinner, Button } from "@chakra-ui/react";
import { fetchCustomerInvoices, type Invoice } from "../../services/customers-service.js";
import InvoiceTracksModal from "./InvoiceTracksModal.js";
import DataTable, { type DataTableColumn } from "../ui/DataTable.js";

interface Props {
    customerId: number | null;
    onClose: () => void;
}

type InvoiceRow = Invoice & {
    invoice_id?: number;
    invoice_date?: string;
};

const getInvoiceId = (invoice: InvoiceRow) => invoice.invoiceId ?? invoice.invoice_id ?? null;
const getInvoiceDate = (invoice: InvoiceRow) => invoice.invoiceDate ?? invoice.invoice_date ?? null;

const CustomerInvoicesModal = ({ customerId, onClose }: Props) => {
    const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);

    const invoiceColumns: DataTableColumn<InvoiceRow>[] = [
        {
            key: "id",
            header: "ID",
            render: invoice => getInvoiceId(invoice) ?? "Unknown",
        },
        {
            key: "date",
            header: "Date",
            render: invoice => {
                const date = getInvoiceDate(invoice);
                return date ? new Date(date).toLocaleDateString() : "Unknown";
            },
        },
        {
            key: "total",
            header: "Total",
            render: invoice => `$${invoice.total}`,
            cellProps: { fontWeight: "bold" },
        },
        {
            key: "actions",
            header: "",
            render: invoice => {
                const invoiceId = getInvoiceId(invoice);

                return (
                    <Button
                        size="xs"
                        colorPalette="green"
                        onClick={() => invoiceId != null && setSelectedInvoiceId(invoiceId)}
                        disabled={invoiceId == null}
                    >
                        Details
                    </Button>
                );
            },
            headerProps: { textAlign: "right" },
            cellProps: { textAlign: "right" },
        },
    ];

    useEffect(() => {
        if (!customerId) return;
        setLoading(true);
        console.log(`[CustomerInvoicesModal] 🟢 Fetching invoices for customer: ${customerId}`);

        fetchCustomerInvoices(customerId)
            .then(data => {
                setInvoices(data);
                console.log(`[CustomerInvoicesModal] ✅ Found ${data.length} invoices`);
            })
            .catch(err => console.error("[CustomerInvoicesModal] ❌ Error:", err))
            .finally(() => setLoading(false));
    }, [customerId]);

    return (
        <>
            <Dialog.Root open={!!customerId} onOpenChange={(e) => !e.open && onClose()}>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content p="6" bg="gray.900" border="1px solid" borderColor="green.500" maxW="lg">
                        <Dialog.Header>
                            <Dialog.Title fontSize="2xl" color="green.300">🧾 Customer Invoices</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            {loading ? <Center py="10"><Spinner color="green.500" /></Center> : (
                                <DataTable
                                    data={invoices}
                                    columns={invoiceColumns}
                                    getRowKey={(invoice) => getInvoiceId(invoice) ?? `${getInvoiceDate(invoice)}-${invoice.total}`}
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

            <InvoiceTracksModal invoiceId={selectedInvoiceId} onClose={() => setSelectedInvoiceId(null)} />
        </>
    );
};

export default CustomerInvoicesModal;
