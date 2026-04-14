import { MaslahatService } from "@/features/consultation/consultation.service"; 
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteMaslahat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => MaslahatService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maslahat"] });
      toast.success("Maslahat muvaffaqiyatli o'chirildi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Maslahatni o'chirishda xatolik");
    },
  });
}