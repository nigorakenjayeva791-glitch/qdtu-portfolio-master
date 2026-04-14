
import { ResearchService } from "@/features/research/research.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface CreateMukofotInput {
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

export function useCreateResearch() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: CreateMukofotInput) => ResearchService.create(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["research"] });
			toast.success("Tatqiqot muvaffaqiyatli qo'shildi");
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Tatqiqot qo'shishda xatolik");
		},
	});
}