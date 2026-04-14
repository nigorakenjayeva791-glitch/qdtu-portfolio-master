import { NazoratService } from "@/features/nazorat/nazorat.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface EditNazoratInput {
  id:number;
	name: string;
	description: string;
	year: number;
	fileUrl: string;
	userId: number;
	researcherName: string;
	univerName: string;
	level: string;
	memberEnum: "MILLIY" | "XALQARO";
	finished: boolean;
}

export function useEditNazorat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: EditNazoratInput) => {
      return NazoratService.edit(input.id,{
        name:input.name,
        description:input.description,
        fileUrl:input.fileUrl,
        finished:input.finished,
        level:input.level,
        researcherName: input.researcherName,
        memberEnum:input.memberEnum,
        univerName:input.univerName,
        userId:input.userId,
        year:input.userId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Nazorat"] });
      toast.success("Nazorat muvaffaqiyatli tahrirlandi");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Nazoratni tahrirlashda xatolik"
      );
    },
  });
}