import { Table } from "@chakra-ui/react";
import { useMemo, useState, type ComponentProps, type ReactNode } from "react";

type SortDirection = "asc" | "desc";
type SortConfig = { key: string; direction: SortDirection } | null;
type SortValue = string | number | null | undefined | Date;

export interface DataTableColumn<T> {
    key: string;
    header: ReactNode;
    accessor?: keyof T;
    sortable?: boolean;
    sortAccessor?: keyof T | ((row: T) => SortValue);
    render?: (row: T) => ReactNode;
    headerProps?: ComponentProps<typeof Table.ColumnHeader>;
    cellProps?: ComponentProps<typeof Table.Cell>;
}

interface DataTableProps<T> {
    data: T[];
    columns: DataTableColumn<T>[];
    getRowKey: (row: T) => string | number;
    onRowClick?: (row: T) => void;
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

const resolveCellContent = <T,>(column: DataTableColumn<T>, row: T): ReactNode => {
    if (column.render) return column.render(row);
    if (column.accessor) return row[column.accessor] as ReactNode;
    return null;
};

const DataTable = <T,>({ data, columns, getRowKey, onRowClick }: DataTableProps<T>) => {
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);

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
        <Table.Root variant="outline" stickyHeader interactive>
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
            <Table.Body>
                {sortedData.map((row) => (
                    <Table.Row
                        key={getRowKey(row)}
                        cursor={onRowClick ? "pointer" : undefined}
                        onClick={onRowClick ? () => onRowClick(row) : undefined}
                    >
                        {columns.map((column) => (
                            <Table.Cell key={column.key} {...column.cellProps}>
                                {resolveCellContent(column, row)}
                            </Table.Cell>
                        ))}
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
};

export default DataTable;
