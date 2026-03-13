import { privateClient, publicClient } from "../apiClient";

export const companyAPI = {
    login: (data: any) => publicClient.post('/company/login', data),
    register: (data: any) => publicClient.post('/company/register', data),
    getCompanyById: (id: string) => publicClient.post(`company/public/${id}`),
    getCompany: () => privateClient.get('/company/profile'),
    updateCompany: (data: any) => privateClient.put('/company/profile', data)
}