import { privateClient, publicClient } from "../apiClient";

export const galleryAPI = {
    //Public endpoints
    getAll: (params?: any) => publicClient.get('/gallery/', { params }),
    getStats: () => publicClient.get('/gallery/stats'),
    getById: (id: BigIntToLocaleStringOptions) => publicClient.get(`/galler/${id}`),

    //Private endpoints
    update: (id: string, data: any) => privateClient.put(`/gallery/${id}`, data),
    delete: (id: string) => privateClient.delete(`/galler/${id}`),
    upload: (data: any) => privateClient.post('/gallery/upload', data)
}