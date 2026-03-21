import { publicClient } from "../apiClient";

export const supportInqiryServiceAPI = {
    submit: (data: any) => publicClient.post('/support-inquires/submit', data),
}