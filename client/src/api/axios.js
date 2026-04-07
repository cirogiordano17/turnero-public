import axios from "axios";

export const api = axios.create({
  baseURL: "https://turnero-public.onrender.com/api",
});