import { Button, Flex, Table, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState, type ComponentProps, type ReactNode } from "react";

type SortDirection = "asc" | "desc";
type SortConfig = { key: string; direction: SortDirection } | null;
type SortValue = string | number | null | undefined | Date;

export interface DataTableColumn<T> {
    key: string;
    header: ReactNode;
    accessor?: keyof T;
    sortable?: boolean;
    sortAccessor?: keyof T | ((row: T) => SortValue);
    render?: (row: T, index: number) => ReactNode;
    headerProps?: ComponentProps<typeof Table.ColumnHeader>;
    cellProps?: ComponentProps<typeof Table.Cell>;
}

interface DataTableProps<T> {
    data: T[];
    columns: DataTableColumn<T>[];
    getRowKey: (row: T, index: number) => string | number | null | undefined;
    onRowClick?: (row: T) => void;
    showHeader?: boolean;
    tableProps?: ComponentProps<typeof Table.Root>;
    pageSize?: number;
}

const normalizeSortValue = (value: SortValue): string | number => {
    if (value == null) return "";
    if (value instanceof Date) return value.getTime();
    if (typeof value === "string") return value.toLowerCase();
    return value;
};

const compareValues = (left: SortValue, right: SortValue) => {
    const normalizedLeft = normalizeSortValue(left);
    const normalizedRight = normalizeSortValue(right);

    if (typeof normalizedLeft === "string" && typeof normalizedRight === "string") {
        return normalizedLeft.localeCompare(normalizedRight);
    }

    if (normalizedLeft < normalizedRight) return -1;
    if (normalizedLeft > normalizedRight) return 1;
    return 0;
};

const resolveSortValue = <T,>(column: DataTableColumn<T>, row: T): SortValue => {
    if (typeof column.sortAccessor === "function") {
        return column.sortAccessor(row);
    }

    if (column.sortAccessor) {
        return row[column.sortAccessor] as SortValue;
    }

    if (column.accessor) {
        return row[column.accessor] as SortValue;
    }

    return null;
};

const resolveCellContent = <T,>(column: DataTableColumn<T>, row: T, index: number): ReactNode => {
    if (column.render) return column.render(row, index);
    if (column.accessor) return row[column.accessor] as ReactNode;
    return null;
};

const DataTable = <T,>({
    data,
    columns,
    getRowKey,
    onRowClick,
    showHeader = true,
    tableProps,
    pageSize,
}: DataTableProps<T>) => {
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const sortedData = useMemo(() => {
        if (!sortConfig) return data;

        const activeColumn = columns.find(column => column.key === sortConfig.key);
        if (!activeColumn || !activeColumn.sortable) return data;

        return [...data].sort((leftRow, rightRow) => {
            const comparison = compareValues(
                resolveSortValue(activeColumn, leftRow),
                resolveSortValue(activeColumn, rightRow),
            );

            return sortConfig.direction === "asc" ? comparison : -comparison;
        });
    }, [columns, data, sortConfig]);

    const totalPages = pageSize ? Math.max(1, Math.ceil(sortedData.length / pageSize)) : 1;

    useEffect(() => {
        setCurrentPage(1);
    }, [data, pageSize, sortConfig]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const paginatedData = useMemo(() => {
        if (!pageSize) return sortedData;

        const startIndex = (currentPage - 1) * pageSize;
        return sortedData.slice(startIndex, startIndex + pageSize);
    }, [currentPage, pageSize, sortedData]);

    const handleSort = (column: DataTableColumn<T>) => {
        if (!column.sortable) return;

        setSortConfig(currentSort => {
            if (currentSort?.key === column.key && currentSort.direction === "asc") {
                return { key: column.key, direction: "desc" };
            }

            return { key: column.key, direction: "asc" };
        });
    };

    const renderSortIndicator = (columnKey: string) => {
        if (sortConfig?.key !== columnKey) return null;
        return sortConfig.direction === "asc" ? " ↑" : " ↓";
    };

    return (
        <>
            <Table.Root variant="outline" stickyHeader interactive {...tableProps}>
                {showHeader ? (
                    <Table.Header>
                        <Table.Row bg="bg.muted">
                            {columns.map((column) => (
                                <Table.ColumnHeader
                                    key={column.key}
                                    cursor={column.sortable ? "pointer" : undefined}
                                    onClick={() => handleSort(column)}
                                    {...column.headerProps}
                                >
                                    {column.header}
                                    {renderSortIndicator(column.key)}
                                </Table.ColumnHeader>
                            ))}
                        </Table.Row>
                    </Table.Header>
                ) : null}
                <Table.Body>
                    {paginatedData.map((row, index) => {
                        const absoluteIndex = pageSize ? (currentPage - 1) * pageSize + index : index;
                        const rowKey = getRowKey(row, absoluteIndex) ?? absoluteIndex;

                        return (
                            <Table.Row
                                key={rowKey}
                                cursor={onRowClick ? "pointer" : undefined}
                                onClick={onRowClick ? () => onRowClick(row) : undefined}
                            >
                                {columns.map((column) => (
                                    <Table.Cell key={`${rowKey}-${column.key}`} {...column.cellProps}>
                                        {resolveCellContent(column, row, absoluteIndex)}
                                    </Table.Cell>
                                ))}
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table.Root>

            {pageSize && totalPages > 1 ? (
                <Flex mt="4" align="center" justify="space-between" gap="3" wrap="wrap">
                    <Text color="gray.400" fontSize="sm">
                        Page {currentPage} of {totalPages}
                    </Text>
                    <Flex gap="2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </Flex>
                </Flex>
            ) : null}
        </>
    );
};

export default DataTable;
