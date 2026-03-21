import { publicClient } from "../apiClient";

export const contactInquiryAPI = {
    submit: (data: any) => publicClient.post('/contact-inquires/submit', data),
}