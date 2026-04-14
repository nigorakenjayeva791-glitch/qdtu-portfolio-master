import { PositionService } from "@/features/positiion/position.service";
import { useQuery } from "@tanstack/react-query";

export function usePosition() {
	return useQuery({
		queryKey: ["positions"],
		queryFn: () => PositionService.getAll(),
	});
}
