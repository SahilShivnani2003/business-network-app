import { privateClient, publicClient } from "../apiClient";

export const leadsAPI = {
    //Public endpoints
    publicGetAll: (params?: any) => publicClient.get('/leads/public'),
    publicGetById: (id: string) => publicClient.get(`/leads/public/${id}`),

    //Private endpoints
    inquiry: (id: string, data: any) => privateClient.post(`/leads/${id}/inquiry`, data),
    comment: (id: string, data: any) => privateClient.post(`/leads/${id}/comment`, data),
    like: (id: string) => privateClient.post(`/leads/${id}/like`),
    create: (data: any) => privateClient.post(`/leads/`, data),
    getMyLeads: (params?: any) => privateClient.get('/leads/my-leads'),
    stats: () => privateClient.get('/leads/stats'),
    getById: (id: string) => privateClient.get(`/leads/${id}`),
    update: (id: string, data: any) => privateClient.put(`/leads/${id}`),
    delete: (id: string) => privateClient.delete(`/leads/${id}`),
    respond: (id: string, data: any) => privateClient.post(`/leads/${id}/respond`, data)
}