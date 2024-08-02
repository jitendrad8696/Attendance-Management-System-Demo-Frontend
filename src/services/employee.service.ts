import axios from "axios";

const api = axios.create({
  baseURL: "https://attendance-management-system-demo-backend.onrender.com/api/v1/employees",
});

export const getEmployees = async () => {
  try {
    const response = await api.get("/getEmployees");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Failed to retrieve employees"
      );
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const getEmployeeData = async (employeeId: string) => {
  try {
    const response = await api.get(`getEmployeeData/${employeeId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Failed to retrieve employee data"
      );
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
