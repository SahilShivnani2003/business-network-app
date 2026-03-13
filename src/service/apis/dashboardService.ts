import { privateClient } from "../apiClient";

export const dashboardAPI = {
    stats: () => privateClient.get('/dashboard/stats'),
    users: (params: any) => privateClient.get('/dashboard/users', { params })
}