import { api } from "./axios";

export async function getAvailability(date, serviceIds) {
  const params = new URLSearchParams();
  params.append("date", date);

  serviceIds.forEach((id) => {
    params.append("service_ids", id);
  });

  const res = await api.get(`/availability?${params.toString()}`);
  return res.data;
}