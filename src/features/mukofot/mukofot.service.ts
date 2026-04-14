import { apiClient } from "@/api/client";
import { MUKOFOT } from "@/constants/apiEndpoint";
import type { AwardRequest, GetbyIdResponse } from "./mukofot";
import type { EditResearchResponse } from "../research/research.type";

export const MukofotService = {
	getById(id: number) {
		return apiClient.get<GetbyIdResponse>(`${MUKOFOT.GETBYID}/${id}`);
	},
	delete(id: number) {
		return apiClient.delete<EditResearchResponse>(`${MUKOFOT.DELETE}/${id}`);
	},
	edit(id: number | string, params: AwardRequest) {
		return apiClient.put(`${MUKOFOT.DELETE}/${id}`, params);
	},
	create(params: AwardRequest) {
		return apiClient.post(MUKOFOT.DELETE, params);
	},
};
