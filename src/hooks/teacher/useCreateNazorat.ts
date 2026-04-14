
import { NazoratService } from "@/features/nazorat/nazorat.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface CreateNazoratInput {
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

export function useCreateNazorat() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: CreateNazoratInput) => NazoratService.create(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["Nazorat"] });
			toast.success("Nazorat muvaffaqiyatli qo'shildi");
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Nazorat qo'shishda xatolik");
		},
	});
}