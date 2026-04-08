import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Spinner, Center, Heading, Button, Flex, Text } from "@chakra-ui/react";
import { fetchCustomers, type Customer } from "../../services/customers-service.js";
import { useAuthStore } from "../../state-management/auth-store.js";
import SalesAgentModal from "./SalesAgentModal.js";
import CustomerInvoicesModal from "./CustomerInvoicesModal.js";
import { Navigate } from "react-router-dom";
import DataTable, { type DataTableColumn } from "../ui/DataTable.js";

const getCustomerFullName = (customer: Customer) => `${customer.firstName} ${customer.lastName}`;
const getCustomerLocation = (customer: Customer) => `${customer.city}, ${customer.country}`;

interface CustomerColumnHandlers {
    onOpenInvoices: (customerId: number) => void;
    onOpenAgent: (customerId: number) => void;
}

const renderCustomerActions = (
    customer: Customer,
    { onOpenInvoices, onOpenAgent }: CustomerColumnHandlers,
) => {
    const handleInvoicesClick = () => {
        onOpenInvoices(customer.id);
    };

    const handleAgentClick = () => {
        onOpenAgent(customer.id);
    };

    return (
        <Flex gap="2" justify="flex-end">
            <Button
                size="sm"
                colorPalette="green"
                variant="outline"
                onClick={handleInvoicesClick}
            >
                Invoices
            </Button>
            <Button
                size="sm"
                colorPalette="cyan"
                variant="outline"
                onClick={handleAgentClick}
            >
                Agent
            </Button>
        </Flex>
    );
};

const createCustomerColumns = (
    handlers: CustomerColumnHandlers,
): DataTableColumn<Customer>[] => [
    {
        key: "name",
        header: "Name",
        sortable: true,
        sortAccessor: getCustomerFullName,
        render: getCustomerFullName,
        cellProps: { fontWeight: "bold" },
    },
    {
        key: "location",
        header: "Location",
        sortable: true,
        sortAccessor: "city",
        render: getCustomerLocation,
        headerProps: { display: { base: "none", md: "table-cell" } },
        cellProps: { display: { base: "none", md: "table-cell" } },
    },
    {
        key: "email",
        header: "Email",
        accessor: "email",
        sortable: true,
        headerProps: { display: { base: "none", md: "table-cell" } },
        cellProps: { display: { base: "none", md: "table-cell" }, color: "gray.500" },
    },
    {
        key: "actions",
        header: "",
        render: customer => renderCustomerActions(customer, handlers),
        headerProps: { textAlign: "right" },
        cellProps: { textAlign: "right" },
    },
];

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

    const handleInvoicesOpen = (customerId: number) => {
        setSelectedInvoicesCustomerId(customerId);
    };

    const handleInvoicesClose = () => {
        setSelectedInvoicesCustomerId(null);
    };

    const handleAgentOpen = (customerId: number) => {
        setSelectedAgentCustomerId(customerId);
    };

    const handleAgentClose = () => {
        setSelectedAgentCustomerId(null);
    };

    const customerColumns = createCustomerColumns({
        onOpenInvoices: handleInvoicesOpen,
        onOpenAgent: handleAgentOpen,
    });

    if (isPending) return <Center h="100vh"><Spinner size="xl" color="blue.500" /></Center>;
    if (error) return <Center h="100vh"><Text color="red.400">Failed to load customers.</Text></Center>;

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

            <CustomerInvoicesModal customerId={selectedInvoicesCustomerId} onClose={handleInvoicesClose} />
            <SalesAgentModal customerId={selectedAgentCustomerId} onClose={handleAgentClose} />
        </Box>
    );
};

export default CustomersPage;
