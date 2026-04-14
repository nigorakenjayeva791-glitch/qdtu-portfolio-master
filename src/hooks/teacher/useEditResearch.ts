import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fileService } from "@/features/file/file.service";
import { ResearchService } from "@/features/research/research.service";

interface EditResearchInput {
	id: string;
	name: string;
	description: string;
	year: number;
	fileUrl: string;
	userId: number;
	member: boolean;
	univerName: string;
	finished: boolean;
	memberEnum: "MILLIY" | "XALQARO";
}

export function useEditResearch() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: EditResearchInput) => {
			return ResearchService.edit(input.id, {
				name: input.name,
				description: input.description,
				fileUrl: input.fileUrl,
				finished: input.finished,
				member: input.member,
				memberEnum: input.memberEnum,
				univerName: input.univerName,
				userId: input.userId,
				year: input.userId,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["research"] });
			toast.success("Tatqiqot muvaffaqiyatli tahrirlandi");
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Taqdimotni tahrirlashda xatolik");
		},
	});
}
