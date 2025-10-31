import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      userData,
    }: {
      userId: number;
      userData: {
        name?: string;
        email?: string;
        birthdate?: string;
      };
    }) => api.updateUser(userId, userData),
    onSuccess: () => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["verifyToken"] });
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: ({
      userId,
      passwordData,
    }: {
      userId: number;
      passwordData: {
        current_password: string;
        new_password: string;
      };
    }) => api.updatePassword(userId, passwordData),
  });
};
