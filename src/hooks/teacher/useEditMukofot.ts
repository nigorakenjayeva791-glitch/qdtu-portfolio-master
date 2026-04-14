import { MukofotService } from "@/features/mukofot/mukofot.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export enum MemberType {
	MILLIY = "MILLIY",
	XALQARO = "XALQARO",
}

export enum AwardType {
	TRENING_VA_AMALIYOT = "Trening_Va_Amaliyot",
	TAHRIRIYAT_KENGASHIGA_AZOLIK = "Tahririyat_Kengashiga_Azolik",
	MAXSUS_KENGASH_AZOLIGI = "Maxsus_Kengash_Azoligi",
	PATENT_DGU = "Patent_Dgu",
	DAVLAT_MUKOFOTI = "Davlat_Mukofoti",
}

// Asosiy ma'lumotlar interfeysi
export interface MukofotInput {
  id:number;
	name: string;
	description: string;
	year: number;
	fileUrl: string;
	userId: number;
	awardEnum: AwardType;
	memberEnum: MemberType;
}
export function useEditMukofot() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: MukofotInput) => {
			const { id, ...data } = input;
			return MukofotService.edit(id, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["mukofot"] });
			toast.success("Mukofot muvaffaqiyatli tahrirlandi");
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Mukofotni tahrirlashda xatolik yuz berdi");
		},
	});
}
