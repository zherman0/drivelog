import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

export const useGetLogs = () => {
  return useQuery({
    queryKey: ["logs"],
    queryFn: () => api.getLogs(),
  });
};

export const useCreateLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (logData: {
      start_time: string;
      end_time: string;
      description: string;
      is_nighttime?: boolean;
    }) => api.createLog(logData),
    onSuccess: () => {
      // Invalidate and refetch logs after creating
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });
};

export const useUpdateLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      logId,
      logData,
    }: {
      logId: number;
      logData: {
        start_time: string;
        end_time: string;
        description: string;
        is_nighttime?: boolean;
      };
    }) => api.updateLog(logId, logData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });
};

export const useDeleteLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (logId: number) => api.deleteLog(logId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });
};
