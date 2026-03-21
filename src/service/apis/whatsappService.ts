import { publicClient } from "../apiClient";

export const whatsappAPI = {
    getAllGroup: (params?: any) => publicClient.get('/whatsapp-group', { params }),
    getGroupById: (id: any) => publicClient.get(`/whatsapp-group/${id}`),
}