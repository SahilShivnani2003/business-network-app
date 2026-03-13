import { privateClient, publicClient } from "../apiClient";

export const eventFormAPI = {
    //Private endpoints
    eventFormStats: () => privateClient.get('/event-forms/stats'),
    eventFormSubmission: (id: string) => privateClient.get(`/event-forms/${id}/submissions`),
    create: (data: any) => privateClient.post('/event-forms/', data),
    getAll: (params?: any) => privateClient.get('/event-forms', { params }),
    getById: (id: string) => privateClient.get(`/event-forms/${id}`),
    update: (id: string, data: any) => privateClient.put(`/event-forms/${id}`, data),
    delete: (id: string) => privateClient.delete(`/event-forms/${id}`),

    //Public endpoints
    publicPublished: () => publicClient.get('/event-forms/public/published'),
    public: (id: string) => publicClient.get(`/event-forms/public/${id}`),
    submit: (data: any) => publicClient.post('/event-forms/submit'),

}