import { apiClient } from "./api-client.js";
import type { Track } from "./albums-service.js";
export interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    city: string;
    country: string;
    email: string;
}

export const fetchCustomers = async (): Promise<Customer[]> => {
    const response = await apiClient.get<Customer[]>("/customers");
    return response.data;
};

export interface SalesAgent {
    firstName: string;
    lastName: string;
    birthDate: string;
    hireDate: string;
    city: string;
    country: string;
    email: string;
}

export const fetchSalesAgent = async (customerId: number): Promise<SalesAgent> => {
    const response = await apiClient.get(`/customers/${customerId}/agent`);
    return response.data;
};
export interface Invoice {
    invoiceId: number;
    invoiceDate: string;
    total: number;
}

interface RawInvoice {
    invoiceId: number;
    invoiceDate: string;
    total: number | string;
}

export interface InvoiceTrack extends Track {
    unitPrice: number;
}

interface RawInvoiceTrack extends Track {
    unitPrice: number | string;
}

// Load invoices for a given customer.
export const fetchCustomerInvoices = async (customerId: number): Promise<Invoice[]> => {
    const response = await apiClient.get<RawInvoice[]>(`/customers/${customerId}/invoices`);

    return response.data.map((invoice) => ({
        ...invoice,
        total: Number(invoice.total),
    }));
};

// Load tracks for a given invoice.
export const fetchInvoiceTracks = async (customerId: number, invoiceId: number): Promise<InvoiceTrack[]> => {
    const response = await apiClient.get<RawInvoiceTrack[]>(`/customers/${customerId}/invoices/${invoiceId}/tracks`);

    return response.data.map((track) => ({
        ...track,
        unitPrice: Number(track.unitPrice),
    }));
};
