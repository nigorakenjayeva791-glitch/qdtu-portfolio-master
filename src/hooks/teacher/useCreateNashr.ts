import { publicationService } from "@/features/publication/publication.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface CreateNashrInput {
	userId: number;
	name: string;
	description: string;
	year: number;
	fileUrl: string;
	type: "ARTICLE" | "PROCEEDING" | "BOOK" | "OTHERS";
	author: "COAUTHOR" | "FIRST_AUTHOR" | "BOTH_AUTHOR";
	degree: "INTERNATIONAL" | "NATIONAL";
	volume: string;
	institution: string;
	popular: boolean;
}

export function useCreateNashr() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: CreateNashrInput) => publicationService.create(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["Nashr"] });
			toast.success("Nashr muvaffaqiyatli qo'shildi");
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Nashr qo'shishda xatolik");
		},
	});
}
