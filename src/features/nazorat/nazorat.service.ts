import { apiClient } from "@/api/client";
import { NAZORAT } from "@/constants/apiEndpoint";
import type { GetbyIdResponse, NazoratCreateDTO } from "./nazorat.type";
import { EditResearchResponse } from "../research/research.type";

export const NazoratService = {
	getById(id: number) {
		return apiClient.get<GetbyIdResponse>(`${NAZORAT.GETBYID}/${id}`);
	},
	delete(id: number) {
		return apiClient.delete<EditResearchResponse>(`${NAZORAT.DELETE}/${id}`);
	},
	edit(id: number | string, params: NazoratCreateDTO) {
		return apiClient.put(`${NAZORAT.DELETE}/${id}`,params);
	},
	create(params: NazoratCreateDTO) {
		return apiClient.post(NAZORAT.DELETE, params);
	},
};
