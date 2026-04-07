// src/components/pages/CustomersPage.tsx
import { useEffect, useState } from "react";
import { Box, Table, Spinner, Center, Heading, Button, Flex } from "@chakra-ui/react";
import { fetchCustomers, type Customer } from "../../services/customers-service.js";
import { useAuthStore } from "../../state-management/auth-store.js";
import SalesAgentModal from "./SalesAgentModal.js";
import { Navigate } from "react-router-dom";

const CustomersPage = () => {
    const role = useAuthStore(s => s.role);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    // ✅ ИСПРАВЛЕНИЕ 1: Хук теперь живет ВНУТРИ компонента
    const [selectedCustomerForAgent, setSelectedCustomerForAgent] = useState<number | null>(null);

    useEffect(() => {
        fetchCustomers()
            .then(data => { setCustomers(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);
    // 🛑 ОХРАНА: Пускаем только SALE и SUPER_USER
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
                        <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {customers.map((c) => (
                        <Table.Row key={c.id || Math.random()}>
                            <Table.Cell fontWeight="bold">{c.firstName} {c.lastName}</Table.Cell>
                            <Table.Cell>{c.city}, {c.country}</Table.Cell>
                            <Table.Cell color="gray.500">{c.email}</Table.Cell>
                            <Table.Cell textAlign="right">
                                <Flex gap="2" justify="flex-end">
                                    {/* Кнопку Invoices оживим позже */}
                                    <Button size="sm" colorPalette="green" variant="outline">
                                        Invoices
                                    </Button>

                                    {/* ✅ ИСПРАВЛЕНИЕ 2: Добавили onClick, который передает ID клиента */}
                                    <Button
                                        size="sm"
                                        colorPalette="cyan"
                                        variant="outline"
                                        onClick={() => {
                                            // Берем ID, как бы он ни назывался в твоей базе!
                                            const correctId = c.id || c.customerId || c.customer_id || null;
                                            setSelectedCustomerForAgent(correctId);
                                        }}
                                    >
                                        Sales Agent
                                    </Button>
                                </Flex>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>

            {/* ✅ ИСПРАВЛЕНИЕ 3: Выводим саму модалку в самом низу страницы */}
            <SalesAgentModal
                customerId={selectedCustomerForAgent}
                onClose={() => setSelectedCustomerForAgent(null)}
            />
        </Box>
    );
};

export default CustomersPage;