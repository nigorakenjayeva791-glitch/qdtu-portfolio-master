import { FILE } from "@/constants/apiEndpoint";
import { fileService } from "@/features/file/file.service";
import { TeacherService } from "@/features/teacher/teacher.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateTeacherInput {
  fullName: string;
  phoneNumber: string;
  image?: File | null;
  lavozmId: number;
  gender: boolean;
  password: string;
  departmentId: number;
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTeacherInput) => {
      const imgUrl = input.image
        ? await fileService.uploadImage(input.image)
        : null;

      return TeacherService.create({
  fullName: input.fullName,
  phoneNumber: input.phoneNumber,
  imgUrl,
  lavozmId: input.lavozmId,
  gender: input.gender,
  password: input.password,
  departmentId: input.departmentId,
});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.refetchQueries({ queryKey: ["teachers"] });
      toast.success("O'qituvchi muvaffaqiyatli qo'shildi");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "O'qituvchini qo'shishda xatolik"
      );
    },
  });
}
