import { apiClient } from "./api-client.js";
import type { Track } from "./albums-service.js";
export interface Customer {
    id?: number;
    customerId?: number;  // Добавили, чтобы TS перестал ругаться
    customer_id?: number; // Добавили, чтобы TS перестал ругаться
    firstName: string;
    lastName: string;
    city: string;
    country: string;
    email: string;
}

export const fetchCustomers = async (): Promise<Customer[]> => {
    const response = await apiClient.get("/customers");
    return response.data;
};
// Добавь это в конец файла src/services/customers-service.ts

export interface SalesAgent {
    firstName: string;
    lastName: string;
    birthDate: string;
    hireDate: string;
    city: string;
    country: string;
    email: string;
}

// ВНИМАНИЕ: Проверь, какой у тебя точный путь на бэкенде!
// Обычно это что-то вроде /customers/:id/agent или /employees/:id
export const fetchSalesAgent = async (customerId: number): Promise<SalesAgent> => {
    const response = await apiClient.get(`/customers/${customerId}/agent`);
    return response.data;
};
export interface Invoice {
    invoiceId: number; // или id, в зависимости от бэкенда
    invoiceDate: string;
    total: number;
}

// Запрос счетов клиента
export const fetchCustomerInvoices = async (customerId: number): Promise<Invoice[]> => {
    const response = await apiClient.get(`/customers/${customerId}/invoices`);
    return response.data;
};

// Запрос треков конкретного счета
export const fetchInvoiceTracks = async (invoiceId: number): Promise<Track[]> => {
    // Внимание: проверь, что роут на бэкенде называется именно так!
    const response = await apiClient.get(`/invoices/${invoiceId}/tracks`);
    return response.data;
};