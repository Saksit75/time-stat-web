import axios, { AxiosInstance } from "axios";

const Axios: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  withCredentials: true,
});

export default Axios;
