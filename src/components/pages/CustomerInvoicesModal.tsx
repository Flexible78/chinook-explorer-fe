import { useEffect, useState } from "react";
import { Center, Dialog, Spinner, Table, Button } from "@chakra-ui/react";
import { fetchCustomerInvoices, type Invoice } from "../../services/customers-service.js";
import InvoiceTracksModal from "./InvoiceTracksModal.js";

interface Props {
    customerId: number | null;
    onClose: () => void;
}

const CustomerInvoicesModal = ({ customerId, onClose }: Props) => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);

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
                                <Table.Root size="sm" variant="outline">
                                    <Table.Header><Table.Row bg="bg.muted">
                                        <Table.ColumnHeader>ID</Table.ColumnHeader>
                                        <Table.ColumnHeader>Date</Table.ColumnHeader>
                                        <Table.ColumnHeader>Total</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign="right"></Table.ColumnHeader>
                                    </Table.Row></Table.Header>
                                    <Table.Body>
                                        {invoices.map((inv) => {
                                            const id = inv.invoiceId || (inv as any).invoice_id;
                                            const date = inv.invoiceDate || (inv as any).invoice_date;
                                            return (
                                                <Table.Row key={id}>
                                                    <Table.Cell>{id}</Table.Cell>
                                                    <Table.Cell>{new Date(date).toLocaleDateString()}</Table.Cell>
                                                    <Table.Cell fontWeight="bold">${inv.total}</Table.Cell>
                                                    <Table.Cell textAlign="right">
                                                        <Button size="xs" colorPalette="green" onClick={() => setSelectedInvoiceId(id)}>Details</Button>
                                                    </Table.Cell>
                                                </Table.Row>
                                            );
                                        })}
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

            <InvoiceTracksModal invoiceId={selectedInvoiceId} onClose={() => setSelectedInvoiceId(null)} />
        </>
    );
};

export default CustomerInvoicesModal;