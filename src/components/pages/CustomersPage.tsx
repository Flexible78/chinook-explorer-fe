import { useEffect, useState } from "react";
import { Box, Table, Spinner, Center, Heading, Button, Flex } from "@chakra-ui/react";
import { fetchCustomers, type Customer } from "../../services/customers-service.js";
import { useAuthStore } from "../../state-management/auth-store.js";
import SalesAgentModal from "./SalesAgentModal.js";
import CustomerInvoicesModal from "./CustomerInvoicesModal.js";
import { Navigate } from "react-router-dom";

const CustomersPage = () => {
    const role = useAuthStore(s => s.role);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedCustomerForAgent, setSelectedCustomerForAgent] = useState<number | null>(null);
    const [selectedCustomerForInvoices, setSelectedCustomerForInvoices] = useState<number | null>(null);

    useEffect(() => {
        console.log("[CustomersPage] 🟢 Loading customers list...");
        fetchCustomers()
            .then(data => {
                setCustomers(data);
                setLoading(false);
                console.log(`[CustomersPage] ✅ Loaded ${data.length} customers`);
            })
            .catch((err) => {
                console.error("[CustomersPage] ❌ Failed to load customers:", err);
                setLoading(false);
            });
    }, []);

    if (role !== "SALE" && role !== "SUPER_USER") {
        return <Navigate to="/albums" replace />;
    }

    if (loading) return <Center h="100vh"><Spinner size="xl" color="blue.500" /></Center>;

    return (
        <Box p="8" maxW="1200px" mx="auto">
            <Heading size="2xl" color="blue.400" mb="8">👥 Customers Directory</Heading>

            <Table.Root variant="outline" stickyHeader interactive>
                <Table.Header>
                    <Table.Row bg="bg.muted">
                        <Table.ColumnHeader>Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Location</Table.ColumnHeader>
                        <Table.ColumnHeader>Email</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="right"></Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {customers.map((c) => {
                        const correctId = c.id || (c as any).customerId || (c as any).customer_id || null;
                        return (
                            <Table.Row key={correctId || Math.random()}>
                                <Table.Cell fontWeight="bold">{c.firstName} {c.lastName}</Table.Cell>
                                <Table.Cell>{c.city}, {c.country}</Table.Cell>
                                <Table.Cell color="gray.500">{c.email}</Table.Cell>
                                <Table.Cell textAlign="right">
                                    <Flex gap="2" justify="flex-end">
                                        <Button
                                            size="sm"
                                            colorPalette="green"
                                            variant="outline"
                                            onClick={() => {
                                                console.log(`[CustomersPage] 🖱 Open Invoices for ID: ${correctId}`);
                                                setSelectedCustomerForInvoices(correctId);
                                            }}
                                        >
                                            Invoices
                                        </Button>

                                        <Button
                                            size="sm"
                                            colorPalette="cyan"
                                            variant="outline"
                                            onClick={() => {
                                                console.log(`[CustomersPage] 🖱 Open Sales Agent for ID: ${correctId}`);
                                                setSelectedCustomerForAgent(correctId);
                                            }}
                                        >
                                            Sales Agent
                                        </Button>
                                    </Flex>
                                </Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table.Root>

            <CustomerInvoicesModal
                customerId={selectedCustomerForInvoices}
                onClose={() => setSelectedCustomerForInvoices(null)}
            />

            <SalesAgentModal
                customerId={selectedCustomerForAgent}
                onClose={() => setSelectedCustomerForAgent(null)}
            />
        </Box>
    );
};

export default CustomersPage;