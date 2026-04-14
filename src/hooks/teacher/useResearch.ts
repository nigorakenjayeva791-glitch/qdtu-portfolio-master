import { ResearchService } from "@/features/research/research.service";
import { useQuery } from "@tanstack/react-query";

export function useResearch(id:number) {
	return useQuery({
		queryKey: ["research"],
		queryFn: () => ResearchService.getById(id),
		enabled: !!id,
	});
}
