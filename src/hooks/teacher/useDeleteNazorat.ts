import { NazoratService } from "@/features/nazorat/nazorat.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteNazorat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => NazoratService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Nazorat"] });
      toast.success("Nazorat muvaffaqiyatli o'chirildi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Nazoratni o'chirishda xatolik");
    },
  });
}