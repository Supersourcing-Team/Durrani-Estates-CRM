/**
 * Module 3 — Deals / Bookings API methods.
 */
import { api } from "./axios";
import { apiEndpoints } from "./apiEndpoint";
import type { ApiResponse } from "./types";
import type {
  BookingDetail,
  BookingListItem,
  BookingListParams,
  CreateBookingPayload,
  DocCategory,
  DocumentDecisionPayload,
  PaymentUpdatePayload,
  ReasonPayload,
  SpaIssuedPayload,
  UploadDocumentPayload,
} from "./deals.types";

function cleanParams(params?: BookingListParams): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  if (!params) return out;
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === "" || v === "all") continue;
    out[k] = v as string | number;
  }
  return out;
}

export async function listBookings(params?: BookingListParams) {
  const { data } = await api.get<ApiResponse<BookingListItem[]>>(apiEndpoints.deals.bookings, {
    params: cleanParams(params),
  });
  return {
    data: data.data || [],
    meta: data.meta || {},
    message: data.message || "",
  };
}

export async function getBooking(id: string | number) {
  const { data } = await api.get<ApiResponse<BookingDetail>>(apiEndpoints.deals.bookingById(id));
  return data;
}

export async function createBooking(payload: CreateBookingPayload) {
  const { data } = await api.post<ApiResponse<BookingDetail>>(apiEndpoints.deals.bookings, payload);
  return data;
}

export async function approveBooking(id: string | number) {
  const { data } = await api.post<ApiResponse<BookingDetail>>(apiEndpoints.deals.approve(id), {});
  return data;
}

export async function requestBookingChanges(id: string | number, payload: ReasonPayload) {
  const { data } = await api.post<ApiResponse<BookingDetail>>(
    apiEndpoints.deals.requestChanges(id),
    payload,
  );
  return data;
}

export async function rejectBooking(id: string | number, payload: ReasonPayload) {
  const { data } = await api.post<ApiResponse<BookingDetail>>(apiEndpoints.deals.reject(id), payload);
  return data;
}

export async function resubmitBooking(id: string | number, payload?: { notes?: string }) {
  const { data } = await api.post<ApiResponse<BookingDetail>>(
    apiEndpoints.deals.resubmit(id),
    payload || {},
  );
  return data;
}

export async function markSpaIssued(id: string | number, payload: SpaIssuedPayload) {
  const { data } = await api.post<ApiResponse<BookingDetail>>(
    apiEndpoints.deals.spaIssued(id),
    payload,
  );
  return data;
}

export async function uploadBookingDocument(
  id: string | number,
  category: DocCategory | string,
  payload: UploadDocumentPayload,
) {
  const { data } = await api.post<ApiResponse<BookingDetail>>(
    apiEndpoints.deals.document(id, category),
    payload,
  );
  return data;
}

export async function decideBookingDocument(
  id: string | number,
  category: DocCategory | string,
  payload: DocumentDecisionPayload,
) {
  const { data } = await api.post<ApiResponse<BookingDetail>>(
    apiEndpoints.deals.documentDecision(id, category),
    payload,
  );
  return data;
}

export async function updateBookingPayment(id: string | number, payload: PaymentUpdatePayload) {
  const { data } = await api.post<ApiResponse<BookingDetail>>(
    apiEndpoints.deals.payments(id),
    payload,
  );
  return data;
}

export async function closeBooking(id: string | number) {
  const { data } = await api.post<ApiResponse<BookingDetail>>(apiEndpoints.deals.close(id), {});
  return data;
}
