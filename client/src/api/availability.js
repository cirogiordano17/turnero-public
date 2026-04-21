import { api } from "./axios";

export async function getAvailability(date, serviceIds) {
  const params = new URLSearchParams();
  params.append("date", date);
  params.append("service_ids", serviceIds.join(","));

  const res = await api.get(`/availability?${params.toString()}`);
  return res.data;
}