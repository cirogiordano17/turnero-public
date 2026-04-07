import { api } from "./axios";

export async function getServices(category) {
  const res = await api.get(`/services?category=${category}`);
  return res.data;
}