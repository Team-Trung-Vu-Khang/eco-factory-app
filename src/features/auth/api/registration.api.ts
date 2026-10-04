import { API_ENDPOINTS } from "@/config/api-endpoints";
import { apiClient } from "@/lib/axios";
import type {
  PhoneAvailabilityResponse,
  RegistrationRequest,
  RegistrationResponse,
} from "../types/registration";

export const registrationApi = {
  /** 400 → fieldErrors, hồ sơ dùng path `factoryProfile.certificates[0].expiryDate` */
  async register(payload: RegistrationRequest): Promise<RegistrationResponse> {
    const { data } = await apiClient.post<RegistrationResponse>(
      API_ENDPOINTS.registrations.base,
      payload,
    );
    return data;
  },

  async checkPhone(phoneNumber: string): Promise<PhoneAvailabilityResponse> {
    const { data } = await apiClient.post<PhoneAvailabilityResponse>(
      API_ENDPOINTS.registrations.phoneAvailability,
      { phoneNumber: phoneNumber.trim() },
    );
    return data;
  },
};
