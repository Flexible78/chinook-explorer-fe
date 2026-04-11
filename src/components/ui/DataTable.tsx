import { Button, Flex, Table, Text } from "@chakra-ui/react";
import { useMemo, useState, type ComponentProps, type ReactNode } from "react";

type SortDirection = "asc" | "desc";
type SortValue = string | number;

export interface DataTableColumn<T> {
    key: string;
    header: ReactNode;
    render: (row: T, index: number) => ReactNode;
    sortValue?: (row: T) => SortValue;
    headerProps?: ComponentProps<typeof Table.ColumnHeader>;
    cellProps?: ComponentProps<typeof Table.Cell>;
    stickyLeft?: string;
    stickyBg?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: DataTableColumn<T>[];
    getRowKey: (row: T, index: number) => string | number | null | undefined;
    onRowClick?: (row: T) => void;
    tableProps?: ComponentProps<typeof Table.Root>;
    pageSize?: number;
}

const compareValues = (left: SortValue, right: SortValue) => {
    if (typeof left === "string" && typeof right === "string") {
        return left.toLowerCase().localeCompare(right.toLowerCase());
    }

    if (left < right) return -1;
    if (left > right) return 1;
    return 0;
};

const DataTable = <T,>({
    data,
    columns,
    getRowKey,
    onRowClick,
    tableProps,
    pageSize,
}: DataTableProps<T>) => {
    const [sortedColumnKey, setSortedColumnKey] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [currentPage, setCurrentPage] = useState(1);

    const sortedData = useMemo(() => {
        if (!sortedColumnKey) return data;

        const activeColumn = columns.find((column) => column.key === sortedColumnKey);
        if (!activeColumn?.sortValue) return data;

        return [...data].sort((leftRow, rightRow) => {
            const leftValue = activeColumn.sortValue ? activeColumn.sortValue(leftRow) : "";
            const rightValue = activeColumn.sortValue ? activeColumn.sortValue(rightRow) : "";
            const result = compareValues(leftValue, rightValue);
            return sortDirection === "asc" ? result : -result;
        });
    }, [columns, data, sortDirection, sortedColumnKey]);

    const totalPages = pageSize ? Math.max(1, Math.ceil(sortedData.length / pageSize)) : 1;
    const currentPageNumber = Math.min(currentPage, totalPages);

    const paginatedData = useMemo(() => {
        if (!pageSize) return sortedData;

        const startIndex = (currentPageNumber - 1) * pageSize;
        return sortedData.slice(startIndex, startIndex + pageSize);
    }, [currentPageNumber, pageSize, sortedData]);

    const handleSort = (column: DataTableColumn<T>) => {
        if (!column.sortValue) return;

        setCurrentPage(1);
        if (sortedColumnKey === column.key) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
            return;
        }

        setSortedColumnKey(column.key);
        setSortDirection("asc");
    };

    const renderSortIndicator = (columnKey: string) => {
        if (sortedColumnKey !== columnKey) return null;
        return sortDirection === "asc" ? " ↑" : " ↓";
    };

    const getAbsoluteIndex = (index: number) => (
        pageSize ? (currentPageNumber - 1) * pageSize + index : index
    );

    const goToPreviousPage = () => {
        setCurrentPage(Math.max(1, currentPageNumber - 1));
    };

    const goToNextPage = () => {
        setCurrentPage(Math.min(totalPages, currentPageNumber + 1));
    };

    const renderTableRow = (row: T, index: number) => {
        const absoluteIndex = getAbsoluteIndex(index);
        const rowKey = getRowKey(row, absoluteIndex) ?? absoluteIndex;
        const handleRowClick = onRowClick ? () => onRowClick(row) : undefined;

        return (
            <Table.Row
                key={rowKey}
                cursor={onRowClick ? "pointer" : undefined}
                onClick={handleRowClick}
            >
                {columns.map((column) => {
                    const stickyCellProps = column.stickyLeft
                        ? {
                            position: "sticky" as const,
                            left: column.stickyLeft,
                            zIndex: 1,
                            bg: column.stickyBg ?? "gray.900",
                        }
                        : {};

                    return (
                        <Table.Cell
                            key={`${rowKey}-${column.key}`}
                            {...stickyCellProps}
                            {...column.cellProps}
                        >
                            {column.render(row, absoluteIndex)}
                        </Table.Cell>
                    );
                })}
            </Table.Row>
        );
    };

    const renderPagination = () => {
        if (!pageSize || totalPages <= 1) {
            return null;
        }

        return (
            <Flex mt="4" align="center" justify="space-between" gap="3" wrap="wrap">
                <Text color="gray.400" fontSize="sm">
                    Page {currentPageNumber} of {totalPages}
                </Text>
                <Flex gap="2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={goToPreviousPage}
                        disabled={currentPageNumber === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={goToNextPage}
                        disabled={currentPageNumber === totalPages}
                    >
                        Next
                    </Button>
                </Flex>
            </Flex>
        );
    };

    return (
        <>
            <Table.Root variant="outline" stickyHeader interactive {...tableProps}>
                <Table.Header>
                    <Table.Row bg="bg.muted">
                        {columns.map((column) => {
                            const stickyHeaderProps = column.stickyLeft
                                ? {
                                    position: "sticky" as const,
                                    left: column.stickyLeft,
                                    zIndex: 2,
                                    bg: column.stickyBg ?? "gray.900",
                                }
                                : {};

                            return (
                                <Table.ColumnHeader
                                    key={column.key}
                                    cursor={column.sortValue ? "pointer" : undefined}
                                    onClick={column.sortValue ? () => handleSort(column) : undefined}
                                    {...stickyHeaderProps}
                                    {...column.headerProps}
                                >
                                    {column.header}
                                    {renderSortIndicator(column.key)}
                                </Table.ColumnHeader>
                            );
                        })}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {paginatedData.map(renderTableRow)}
                </Table.Body>
            </Table.Root>

            {renderPagination()}
        </>
    );
};

export default DataTable;
