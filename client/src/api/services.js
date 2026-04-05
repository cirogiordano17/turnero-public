import { api } from "./axios";

export async function getServices(category) {
  const response = await api.get(`/services?category=${category}`);
  return response.data;
}