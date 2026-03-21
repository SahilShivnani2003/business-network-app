import { privateClient, publicClient } from "../apiClient";

export const communityAPI = {
    getAll: () => publicClient.get('/communities'),
    create: (data: any) => publicClient.post('/communities', data),
    getById: (id: string) => publicClient.get(`/communities/${id}`),
    myCommunity: () => privateClient.get('/communities/my/communities'),
    join: (id: string) => privateClient.post(`/communities/${id}/join`),
    leave: (id: string) => privateClient.post(`/communities/${id}/leave`),
    createMessage: (id: string, data: any) => privateClient.post(`/communities/${id}/messages`, data),
    getMessages: (id: string) => privateClient.get(`/communities/${id}/messages`),
}