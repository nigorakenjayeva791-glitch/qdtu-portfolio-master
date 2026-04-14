import { MaslahatService } from "@/features/consultation/consultation.service";
import { useQuery } from "@tanstack/react-query";

export function useMaslahat(id:number) {
	return useQuery({
		queryKey: ["maslahat"],
		queryFn: () => MaslahatService.getById(id),
		enabled: !!id,
	});
}
