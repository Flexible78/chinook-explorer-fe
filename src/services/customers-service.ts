import { apiClient } from "./api-client.js";

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