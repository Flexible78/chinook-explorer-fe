// src/components/pages/CustomersPage.tsx
import { useEffect, useState } from "react";
import { Box, Table, Spinner, Center, Heading, Button, Flex } from "@chakra-ui/react";
import { fetchCustomers, type Customer } from "../../services/customers-service.js";
import { useAuthStore } from "../../state-management/auth-store.js";
import { Navigate } from "react-router-dom";

const CustomersPage = () => {
    const role = useAuthStore(s => s.role); // Достаем роль из памяти
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    // 🛑 ОХРАНА: Пускаем только SALE и SUPER_USER
    if (role !== "SALE" && role !== "SUPER_USER") {
        return <Navigate to="/albums" replace />;
    }

    useEffect(() => {
        fetchCustomers()
            .then(data => { setCustomers(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

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
                        <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {customers.map((c) => (
                        // Используем c.id, если с бэкенда приходит id. Если customer_id — поменяй!
                        <Table.Row key={c.id || Math.random()}>
                            <Table.Cell fontWeight="bold">{c.firstName} {c.lastName}</Table.Cell>
                            <Table.Cell>{c.city}, {c.country}</Table.Cell>
                            <Table.Cell color="gray.500">{c.email}</Table.Cell>
                            <Table.Cell textAlign="right">
                                <Flex gap="2" justify="flex-end">
                                    <Button size="sm" colorPalette="green" variant="outline">
                                        Invoices
                                    </Button>
                                    <Button size="sm" colorPalette="cyan" variant="outline">
                                        Sales Agent
                                    </Button>
                                </Flex>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Box>
    );
};

export default CustomersPage;