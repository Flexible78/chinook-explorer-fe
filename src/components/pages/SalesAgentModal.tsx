import { useQuery } from "@tanstack/react-query";
import { Center, Dialog, Spinner, Text, Stack, Badge, Button } from "@chakra-ui/react";
import { fetchSalesAgent, type SalesAgent } from "../../services/customers-service.js";

interface Props {
    customerId: number | null;
    onClose: () => void;
}

const formatAgentDate = (value: string) => new Date(value).toLocaleDateString();

const renderAgentDetails = (agent: SalesAgent) => (
    <Stack gap="3" mt="4">
        <Text fontSize="xl" fontWeight="bold">
            {agent.firstName} {agent.lastName}
        </Text>
        <Text color="gray.400">📧 {agent.email}</Text>
        <Text>🌍 Location: <Badge colorPalette="cyan">{agent.city}, {agent.country}</Badge></Text>
        <Text>🎂 Birth Date: {formatAgentDate(agent.birthDate)}</Text>
        <Text>🏢 Hire Date: {formatAgentDate(agent.hireDate)}</Text>
    </Stack>
);

const SalesAgentModal = ({ customerId, onClose }: Props) => {
    const { data: agent, isPending, error } = useQuery<SalesAgent>({
        queryKey: ["customers", customerId, "agent"],
        queryFn: () => fetchSalesAgent(customerId as number),
        enabled: customerId !== null,
    });

    const handleDialogOpenChange = (details: { open: boolean }) => {
        if (!details.open) {
            onClose();
        }
    };

    const renderModalBody = () => {
        if (isPending) {
            return <Center py="10"><Spinner color="cyan.500" /></Center>;
        }

        if (error) {
            return <Text color="red.400">Failed to load agent</Text>;
        }

        if (!agent) {
            return <Text color="red.400">Agent not found</Text>;
        }

        return renderAgentDetails(agent);
    };

    return (
        <Dialog.Root open={!!customerId} onOpenChange={handleDialogOpenChange}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content p="6" bg="gray.900" border="1px solid" borderColor="cyan.500" position="relative">
                    <Dialog.Header>
                        <Dialog.Title fontSize="2xl" color="cyan.300" pr="8">
                            👔 Sales Agent Profile
                        </Dialog.Title>
                    </Dialog.Header>

                    <Dialog.Body pb="4">{renderModalBody()}</Dialog.Body>

                    <Dialog.CloseTrigger asChild position="absolute" top="2" right="2">
                        <Button variant="ghost" size="sm" px="2" color="gray.400" _hover={{ color: "white", bg: "red.500" }}>
                            ✕
                        </Button>
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};

export default SalesAgentModal;
