import { apiClient } from "./api-client.js";

export interface Customer {
    id: number; // На бэкенде может быть customerId, проверим!
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