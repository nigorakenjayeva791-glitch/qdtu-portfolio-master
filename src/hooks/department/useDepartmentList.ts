import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useDepartmentList = () => {
  return useQuery({
    queryKey: ["department-list"],
    queryFn: async () => {
      const res = await axios.get("/department");
      return res.data;
    },
  });
};