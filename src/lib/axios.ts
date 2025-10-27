import axios, { AxiosInstance } from "axios";

// สร้าง axios instance
const Axios: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api", // path เริ่มต้น
  withCredentials: true, // ถ้าต้องส่ง cookie
});

export default Axios;
