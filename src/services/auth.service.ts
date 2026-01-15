import axios from "../lib/axios";

export const AuthService = {
  login: async (email: string, password: string) => {
    const res = await axios.post("/api/auth/login", { email, password });
    return res.data;
  },
  register:async (email: string, password: string) => {
    const res = await axios.post("/api/auth/register", { email, password });
    return res.data;
  },
  getToken: async(refreshToken: string) =>{
    const res = await axios.post("/api/auth/refresh-token", { refreshToken });
    return res.data;
  }
};
