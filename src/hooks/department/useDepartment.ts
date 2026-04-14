import { departmentService } from "@/features/departments/department.service";
import { useQuery } from "@tanstack/react-query";

export function useDepartment() {
	return useQuery({
		queryKey: ["departments"],
		queryFn: () => departmentService.getAll(),
	});
}
