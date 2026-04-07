import { useEffect, useState, useMemo } from "react";
import { Box, Table, Spinner, Center, Heading, Button, Flex } from "@chakra-ui/react";
import { fetchCustomers, type Customer } from "../../services/customers-service.js";
import { useAuthStore } from "../../state-management/auth-store.js";
import SalesAgentModal from "./SalesAgentModal.js";
import CustomerInvoicesModal from "./CustomerInvoicesModal.js";
import { Navigate } from "react-router-dom";

type SortConfig = { key: keyof Customer; direction: "asc" | "desc" } | null;

const CustomersPage = () => {
    const role = useAuthStore(s => s.role);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomerForAgent, setSelectedCustomerForAgent] = useState<number | null>(null);
    const [selectedCustomerForInvoices, setSelectedCustomerForInvoices] = useState<number | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);

    useEffect(() => {
        fetchCustomers()
            .then(data => { setCustomers(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (role !== "SALE" && role !== "SUPER_USER") return <Navigate to="/albums" replace />;

    const sortedCustomers = useMemo(() => {
        if (!sortConfig) return customers;
        return [...customers].sort((a, b) => {
            const valA = a[sortConfig.key] || "";
            const valB = b[sortConfig.key] || "";
            if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
            if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [customers, sortConfig]);

    const handleSort = (key: keyof Customer) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    if (loading) return <Center h="100vh"><Spinner size="xl" color="blue.500" /></Center>;

    return (
        <Box p={{ base: "4", md: "8" }} maxW="1200px" mx="auto">
            <Heading size="2xl" color="blue.400" mb="8">👥 Customers Directory</Heading>

            <Box overflowX="auto">
                <Table.Root variant="outline" stickyHeader interactive>
                    <Table.Header>
                        <Table.Row bg="bg.muted">
                            <Table.ColumnHeader cursor="pointer" onClick={() => handleSort("firstName")}>
                                Name {sortConfig?.key === "firstName" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                            </Table.ColumnHeader>
                            <Table.ColumnHeader cursor="pointer" onClick={() => handleSort("city")} display={{ base: "none", md: "table-cell" }}>
                                Location {sortConfig?.key === "city" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                            </Table.ColumnHeader>
                            <Table.ColumnHeader cursor="pointer" onClick={() => handleSort("email")} display={{ base: "none", md: "table-cell" }}>
                                Email {sortConfig?.key === "email" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                            </Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="right"></Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {sortedCustomers.map((c) => {
                            const id = c.id || (c as any).customerId || (c as any).customer_id;
                            return (
                                <Table.Row key={id}>
                                    <Table.Cell fontWeight="bold">{c.firstName} {c.lastName}</Table.Cell>
                                    <Table.Cell display={{ base: "none", md: "table-cell" }}>{c.city}, {c.country}</Table.Cell>
                                    <Table.Cell display={{ base: "none", md: "table-cell" }} color="gray.500">{c.email}</Table.Cell>
                                    <Table.Cell textAlign="right">
                                        <Flex gap="2" justify="flex-end">
                                            <Button size="sm" colorPalette="green" variant="outline" onClick={() => setSelectedCustomerForInvoices(id)}>
                                                Invoices
                                            </Button>
                                            <Button size="sm" colorPalette="cyan" variant="outline" onClick={() => setSelectedCustomerForAgent(id)}>
                                                Agent
                                            </Button>
                                        </Flex>
                                    </Table.Cell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table.Root>
            </Box>

            <CustomerInvoicesModal customerId={selectedCustomerForInvoices} onClose={() => setSelectedCustomerForInvoices(null)} />
            <SalesAgentModal customerId={selectedCustomerForAgent} onClose={() => setSelectedCustomerForAgent(null)} />
        </Box>
    );
};

export default CustomersPage;