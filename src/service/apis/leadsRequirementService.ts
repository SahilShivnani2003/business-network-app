import { privateClient, publicClient } from "../apiClient";

export const leadsRequirementService = {
    getAllActive: (params?: any) => publicClient.get('/lead-requirements/active', { params }),

    //Private Endpoints 
    create: (data: any) => privateClient.get('/lead-requirements', data),
    myRequirements: (params?: any) => privateClient.get('/lead-requirements/my/requirements'),
    update: (data: any, id: string) => privateClient.put(`/lead-requirements/${id}`, data),
    delete: (id: string) => privateClient.delete(`/lead-requirements/${id}`),
    getById: (id: string) => privateClient.get(`/lead-requirements/${id}`),
    respond: (id: string, data: any) => privateClient.post(`/lead-requirements/${id}/respond`),
}