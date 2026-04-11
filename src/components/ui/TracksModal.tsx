import { Button, Center, Dialog, Spinner, Table, Text, Box } from "@chakra-ui/react";
import type { ComponentProps } from "react";
import DataTable, { type DataTableColumn } from "./DataTable.js";

interface TracksModalProps<T> {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    tracks: T[];
    loading: boolean;
    columns: DataTableColumn<T>[];
    getRowKey: (track: T, index: number) => string | number | null | undefined;
    spinnerColor?: string;
    errorMessage?: string | null;
    tableProps?: ComponentProps<typeof Table.Root>;
    contentProps?: ComponentProps<typeof Dialog.Content>;
    titleProps?: ComponentProps<typeof Dialog.Title>;
    pageSize?: number;
}

const TracksModal = <T,>({
                             isOpen,
                             onClose,
                             title,
                             tracks,
                             loading,
                             columns,
                             getRowKey,
                             spinnerColor = "purple.500",
                             errorMessage,
                             tableProps,
                             contentProps,
                             titleProps,
                             pageSize,
                         }: TracksModalProps<T>) => {
    const handleDialogOpenChange = (details: { open: boolean }) => {
        if (!details.open) {
            onClose();
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={handleDialogOpenChange}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content
                    p="4"
                    position="relative"
                    bg="gray.900"
                    border="1px solid"
                    borderColor="purple.500"
                    {...contentProps}
                >
                    <Dialog.Header>
                        <Dialog.Title fontSize="xl" pr="8" color="purple.300" lineHeight="1.2" {...titleProps}>
                            {title}
                        </Dialog.Title>
                    </Dialog.Header>

                    <Dialog.Body pt="2" pb="2" px="0">
                        {loading && <Center py="10"><Spinner color={spinnerColor} /></Center>}

                        {!loading && errorMessage && (
                            <Center py="10">
                                <Text color="red.400">{errorMessage}</Text>
                            </Center>
                        )}

                        {!loading && !errorMessage && (
                            <Box overflowX="auto" maxW="100%">
                                <DataTable
                                    data={tracks}
                                    columns={columns}
                                    getRowKey={getRowKey}
                                    tableProps={{
                                        size: "sm",
                                        variant: "line",
                                        css: {
                                            "& th, & td": {
                                                px: "2.5",
                                                py: "2",
                                            },
                                        },
                                        ...tableProps,
                                    }}
                                    pageSize={pageSize}
                                />
                            </Box>
                        )}
                    </Dialog.Body>

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

export default TracksModal;
