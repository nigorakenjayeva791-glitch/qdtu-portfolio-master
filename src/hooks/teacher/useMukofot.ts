import { MukofotService } from "@/features/mukofot/mukofot.service";
import { useQuery } from "@tanstack/react-query";

export function useAward(id:number) {
	return useQuery({
		queryKey: ["mukofot"],
		queryFn: () => MukofotService.getById(id),
		enabled: !!id,
	});
}
