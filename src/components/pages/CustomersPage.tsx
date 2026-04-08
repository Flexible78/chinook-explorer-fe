import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Spinner, Center, Heading, Button, Flex, Text } from "@chakra-ui/react";
import { fetchCustomers, type Customer } from "../../services/customers-service.js";
import { useAuthStore } from "../../state-management/auth-store.js";
import SalesAgentModal from "./SalesAgentModal.js";
import CustomerInvoicesModal from "./CustomerInvoicesModal.js";
import { Navigate } from "react-router-dom";
import DataTable, { type DataTableColumn } from "../ui/DataTable.js";

const CustomersPage = () => {
    const role = useAuthStore(s => s.role);
    const [selectedAgentCustomerId, setSelectedAgentCustomerId] = useState<number | null>(null);
    const [selectedInvoicesCustomerId, setSelectedInvoicesCustomerId] = useState<number | null>(null);
    const canViewCustomers = role === "SALE" || role === "SUPER_USER";

    const { data: customers = [], isPending, error } = useQuery<Customer[]>({
        queryKey: ["customers"],
        queryFn: fetchCustomers,
        enabled: canViewCustomers,
    });

    if (!canViewCustomers) return <Navigate to="/albums" replace />;

    if (isPending) return <Center h="100vh"><Spinner size="xl" color="blue.500" /></Center>;
    if (error) return <Center h="100vh"><Text color="red.400">Failed to load customers.</Text></Center>;

    const customerColumns: DataTableColumn<Customer>[] = [
        {
            key: "name",
            header: "Name",
            render: (customer) => `${customer.firstName} ${customer.lastName}`,
            sortValue: (customer) => `${customer.firstName} ${customer.lastName}`,
            cellProps: { fontWeight: "bold" },
        },
        {
            key: "location",
            header: "Location",
            render: (customer) => `${customer.city}, ${customer.country}`,
            sortValue: (customer) => `${customer.city}, ${customer.country}`,
            headerProps: { display: { base: "none", md: "table-cell" } },
            cellProps: { display: { base: "none", md: "table-cell" } },
        },
        {
            key: "email",
            header: "Email",
            render: (customer) => customer.email,
            sortValue: (customer) => customer.email,
            headerProps: { display: { base: "none", md: "table-cell" } },
            cellProps: { display: { base: "none", md: "table-cell" }, color: "gray.500" },
        },
        {
            key: "actions",
            header: "",
            render: (customer) => (
                <Flex gap="2" justify="flex-end">
                    <Button
                        size="sm"
                        colorPalette="green"
                        variant="outline"
                        onClick={() => setSelectedInvoicesCustomerId(customer.id)}
                    >
                        Invoices
                    </Button>
                    <Button
                        size="sm"
                        colorPalette="cyan"
                        variant="outline"
                        onClick={() => setSelectedAgentCustomerId(customer.id)}
                    >
                        Agent
                    </Button>
                </Flex>
            ),
            headerProps: { textAlign: "right" },
            cellProps: { textAlign: "right" },
        },
    ];

    return (
        <Box p={{ base: "4", md: "8" }} maxW="1200px" mx="auto">
            <Heading size="2xl" color="blue.400" mb="8">👥 Customers Directory</Heading>

            <Box overflowX="auto">
                <DataTable
                    data={customers}
                    columns={customerColumns}
                    getRowKey={(customer) => customer.id}
                    pageSize={10}
                />
            </Box>

            <CustomerInvoicesModal customerId={selectedInvoicesCustomerId} onClose={() => setSelectedInvoicesCustomerId(null)} />
            <SalesAgentModal customerId={selectedAgentCustomerId} onClose={() => setSelectedAgentCustomerId(null)} />
        </Box>
    );
};

export default CustomersPage;
