import { PositionService } from "@/features/positiion/position.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdatePositionDto {
  id: number;
  data: {
    name: string;
  };
}

export function useUpdatePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdatePositionDto) => {
      return PositionService.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      toast.success("Lavozim muvaffaqiyatli yangilandi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Lavozimni yangilashda xatolik");
    },
  });
}