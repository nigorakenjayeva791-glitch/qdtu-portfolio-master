import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const usePositionList = () => {
  return useQuery({
    queryKey: ["position-list"],
    queryFn: async () => {
      const res = await axios.get("/position");
      return res.data;
    },
  });
};