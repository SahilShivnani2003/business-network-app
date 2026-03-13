import { privateClient, publicClient } from "../apiClient";

export const subcriptionAPI = {
    //Public endpoints
    plans: () => publicClient.get('/subscriptions/plans'),

    //Private endpoints
    mySubcriptions: () => privateClient.get('/subcriptions/my-subscription'),
    subscribe: (data: any) => privateClient.post('/subscriptions/subcribe', data),
    cancel: (data: any) => privateClient.post('/subscriptions/cancel', data),
    getUsage: () => privateClient.get('/subscriptions/usage'),
    getPaymentHistory: () => privateClient.get('/subscriptions/payment-history'),
    myRequest: () => privateClient.get('/subscriptions/my-requests'),
}