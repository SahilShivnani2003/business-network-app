import { privateClient, publicClient } from "../apiClient";

export const ratingAPI = {
    companies: (params: any) => publicClient.get('ratings/companies'),
    company: (id: string) => publicClient.get(`/rating/company/${id}`),

    //Private Endpoint
    addCompanyRating: (id: string, data: any) => privateClient.get(`/ratings/company/${id}`, data),
    getMyRating: (id: string) => privateClient.get(`/ratings/company/${id}/my-rating`),
    delete: (id: string) => privateClient.delete(`/ratings/${id}`),
}