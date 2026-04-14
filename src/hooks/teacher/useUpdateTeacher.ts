import { fileService } from "@/features/file/file.service";
import { TeacherService } from "@/features/teacher/teacher.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface EditTeacherInput {
  id: number;
  fullName: string;
  phoneNumber: string;
  imgUrl?: File | null;
  lavozmId: number;
  gender: boolean;
  password?: string;
  departmentId: number;
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: EditTeacherInput) => {
      const imgUrl = input.imgUrl
        ? await fileService.uploadImage(input.imgUrl)
        : null;

      return TeacherService.edit({
        id: input.id,
        fullName: input.fullName,
        phoneNumber: input.phoneNumber,
        imgUrl: imgUrl ?? null,
        lavozmId: input.lavozmId,
        gender: input.gender,
        departmentId: input.departmentId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("O'qituvchi muvaffaqiyatli tahrirlandi");
    },
    onError: (error: any) => {
      console.log("UPDATE ERROR:", error?.response?.data); // ← QO'SHILDI
      toast.error(
        error?.response?.data?.message || "O'qituvchini tahrirlashda xatolik"
      );
    },
  });
}