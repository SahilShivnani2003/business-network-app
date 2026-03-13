import { privateClient } from "../apiClient";

export const eventsAPI = {
    getAll: (params?: any) => privateClient.get('/events/'),
    create: (data: any) => privateClient.post('/events/', data),
    getStats: () => privateClient.get('/events/stats'),
    getById: (id: string) => privateClient.get(`/events/${id}`),
    update: (id: string, data: any) => privateClient.put(`/events/${id}`),
    delete: (id: string) => privateClient.delete(`/events/${id}`),
    eventLike: (id: string) => privateClient.post(`/events/${id}/likes`)
}