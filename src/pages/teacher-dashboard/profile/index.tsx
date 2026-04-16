import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { TeacherService } from "@/features/teacher/teacher.service";
import { useUpdateTeacher } from "@/hooks/teacher/useUpdateTeacher";
import { useCreateTeacher } from "@/hooks/teacher/useCreateTeacher";
import { ProfileForm } from "@/pages/teachers/detail/detail-profile/profile-form";

export default function TeacherProfile() {
  const { id } = useParams();
  const isEdit = !!id;
  const teacherId = Number(id);

  const { data: response, isLoading } = useQuery({
    queryKey: ["teacher", teacherId],
    queryFn: () => TeacherService.getById(teacherId),
    enabled: isEdit,
  });

  const { mutate: updateTeacher, isPending: isUpdating } = useUpdateTeacher();
  const { mutate: createTeacher, isPending: isCreating } = useCreateTeacher();

  const handleSave = (formData: any) => {
    if (isEdit) {
      updateTeacher({ id: teacherId, ...formData });
    } else {
      createTeacher(formData);
    }
  };

  if (isEdit && isLoading) return <div>Yuklanmoqda...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 items-start">
      <div className="w-full lg:flex-1 min-w-0">
        <ProfileForm
          defaultValues={isEdit ? response?.data : {}}
          onSubmit={handleSave}
          isPending={isUpdating || isCreating}
        />
      </div>
    </div>
  );
}