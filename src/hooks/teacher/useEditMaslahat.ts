import { MaslahatService } from "@/features/consultation/consultation.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ConsultationInput {
  id:number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  member: boolean;
  finishedEnum: "COMPLETED" | "IN_PROGRESS" | "FINISHED";
  leader: string;
}

export function useEditMaslahat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ConsultationInput) => {
      const { id, ...data } = input;
      return MaslahatService.edit(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maslahat"] });
      toast.success("Maslahat muvaffaqiyatli tahrirlandi");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Maslahatni tahrirlashda xatolik yuz berdi"
      );
    },
  });
}