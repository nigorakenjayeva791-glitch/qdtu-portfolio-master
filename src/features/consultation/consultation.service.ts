import { apiClient } from "@/api/client"
import { MASLAHAT } from "@/constants/apiEndpoint"
import type { ApiResponse, GetbyIdResponse, PublicationRequest } from "./consultation.type" 

export const MaslahatService={
  getById(id:number){
    return apiClient.get<GetbyIdResponse>(`${MASLAHAT.GETBYID}/${id}`)
  },
  delete(id:number){
    return apiClient.delete<ApiResponse>(`${MASLAHAT.DELETE}/${id}`)
  },
  edit(id: number | string, params: PublicationRequest) {
		return apiClient.put(`${MASLAHAT.DELETE}/${id}`,params);
	},
	create(params: PublicationRequest) {
		return apiClient.post(MASLAHAT.DELETE, params);
	},
}