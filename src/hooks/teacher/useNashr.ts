
import { publicationService } from "@/features/publication/publication.service";
import { useQuery } from "@tanstack/react-query";

export function useNashr(id:number) {
	return useQuery({
		queryKey: ["Nashr"],
		queryFn: () => publicationService.getById(id),
		enabled: !!id,
	});
}
