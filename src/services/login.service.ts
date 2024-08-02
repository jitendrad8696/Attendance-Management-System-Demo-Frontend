import axios from "axios";

interface LoginData {
  email: string;
  password: string;
}

const api = axios.create({
  baseURL: "https://attendance-management-system-demo-backend.onrender.com/api/v1",
});

export const loginApi = async (data: LoginData) => {
  try {
    const response = await api.post("/users/login", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Login failed");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
