import { Button, Center, Dialog, Spinner, Table, Text } from "@chakra-ui/react";
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
    spinnerColor: string;
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
    spinnerColor,
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

    const renderModalBody = () => {
        if (loading) {
            return <Center py="10"><Spinner color={spinnerColor} /></Center>;
        }

        if (errorMessage) {
            return (
                <Center py="10">
                    <Text color="red.400">{errorMessage}</Text>
                </Center>
            );
        }

        return (
            <DataTable
                data={tracks}
                columns={columns}
                getRowKey={getRowKey}
                tableProps={tableProps}
                pageSize={pageSize}
            />
        );
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={handleDialogOpenChange}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content p="6" position="relative" {...contentProps}>
                    <Dialog.Header>
                        <Dialog.Title fontSize="xl" pr="8" {...titleProps}>
                            {title}
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

export default TracksModal;
