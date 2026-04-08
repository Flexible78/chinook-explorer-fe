import { useEffect, useState } from "react";
import { Box, Spinner, Center, Heading, Button, Flex } from "@chakra-ui/react";
import { fetchCustomers, type Customer } from "../../services/customers-service.js";
import { useAuthStore } from "../../state-management/auth-store.js";
import SalesAgentModal from "./SalesAgentModal.js";
import CustomerInvoicesModal from "./CustomerInvoicesModal.js";
import { Navigate } from "react-router-dom";
import DataTable, { type DataTableColumn } from "../ui/DataTable.js";

const getCustomerId = (customer: Customer) => (
    customer.id ?? customer.customerId ?? customer.customer_id ?? null
);

const CustomersPage = () => {
    const role = useAuthStore(s => s.role);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomerForAgent, setSelectedCustomerForAgent] = useState<number | null>(null);
    const [selectedCustomerForInvoices, setSelectedCustomerForInvoices] = useState<number | null>(null);

    useEffect(() => {
        fetchCustomers()
            .then(data => { setCustomers(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (role !== "SALE" && role !== "SUPER_USER") return <Navigate to="/albums" replace />;

    const customerColumns: DataTableColumn<Customer>[] = [
        {
            key: "name",
            header: "Name",
            sortable: true,
            sortAccessor: customer => `${customer.firstName} ${customer.lastName}`,
            render: customer => `${customer.firstName} ${customer.lastName}`,
            cellProps: { fontWeight: "bold" },
        },
        {
            key: "location",
            header: "Location",
            sortable: true,
            sortAccessor: "city",
            render: customer => `${customer.city}, ${customer.country}`,
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
            render: customer => {
                const customerId = getCustomerId(customer);

                return (
                    <Flex gap="2" justify="flex-end">
                        <Button
                            size="sm"
                            colorPalette="green"
                            variant="outline"
                            onClick={() => customerId != null && setSelectedCustomerForInvoices(customerId)}
                            disabled={customerId == null}
                        >
                            Invoices
                        </Button>
                        <Button
                            size="sm"
                            colorPalette="cyan"
                            variant="outline"
                            onClick={() => customerId != null && setSelectedCustomerForAgent(customerId)}
                            disabled={customerId == null}
                        >
                            Agent
                        </Button>
                    </Flex>
                );
            },
            headerProps: { textAlign: "right" },
            cellProps: { textAlign: "right" },
        },
    ];

    if (loading) return <Center h="100vh"><Spinner size="xl" color="blue.500" /></Center>;

    return (
        <Box p={{ base: "4", md: "8" }} maxW="1200px" mx="auto">
            <Heading size="2xl" color="blue.400" mb="8">👥 Customers Directory</Heading>

            <Box overflowX="auto">
                <DataTable
                    data={customers}
                    columns={customerColumns}
                    getRowKey={(customer, index) => getCustomerId(customer) ?? `${customer.email}-${customer.firstName}-${customer.lastName}-${index}`}
                    pageSize={10}
                />
            </Box>

            <CustomerInvoicesModal customerId={selectedCustomerForInvoices} onClose={() => setSelectedCustomerForInvoices(null)} />
            <SalesAgentModal customerId={selectedCustomerForAgent} onClose={() => setSelectedCustomerForAgent(null)} />
        </Box>
    );
};

export default CustomersPage;
