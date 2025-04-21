/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_RAZORPAY_PAYMENTS_BE_URL;

export interface CreatePaymentLinkRequest {
  applicantId: string;
  amount: number;
  upiId: string;
}

export interface PaymentLinkResponse {
  reference_id: string;
  payment_link_id: string;
  payment_link_url: string;
  amount: number;
  currency: string;
  upi_id: string;
}

export const razorpayApi = {
  createPaymentLink: async (
    data: CreatePaymentLinkRequest,
    token: string
  ): Promise<PaymentLinkResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/payment/upi/create-link`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw new Error((error as any)?.response?.data?.msg || "Failed to create payment link");
    }
  }
};
