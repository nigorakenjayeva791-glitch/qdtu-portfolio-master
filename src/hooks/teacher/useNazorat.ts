
import { NazoratService } from "@/features/nazorat/nazorat.service";
import { useQuery } from "@tanstack/react-query";

export function useNazorat(id:number) {
	return useQuery({
		queryKey: ["Nazorat"],
		queryFn: () => NazoratService.getById(id),
		enabled: !!id,
	});
}
