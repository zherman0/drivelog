import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { LoginRequest, RegisterRequest } from "../services/api";

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginRequest) => api.login(credentials),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (userData: RegisterRequest) => api.register(userData),
  });
};

export const useVerifyToken = () => {
  return useQuery({
    queryKey: ["verifyToken"],
    queryFn: () => api.verifyToken(),
    enabled: !!localStorage.getItem("token"),
    retry: false,
  });
};

export const useGetUser = (userId: number | null) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => api.getUser(userId!),
    enabled: !!userId,
  });
};
