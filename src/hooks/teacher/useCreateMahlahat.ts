import { MaslahatService } from "@/features/consultation/consultation.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ConsultationInput {
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  member: boolean;
  finishedEnum: "COMPLETED" | "IN_PROGRESS" | "FINISHED";
  leader: string;
}

export function useCreateMaslahat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ConsultationInput) => MaslahatService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maslahat"] });
      toast.success("Maslahat muvaffaqiyatli qo'shildi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Maslahat qo'shishda xatolik");
    },
  });
}
