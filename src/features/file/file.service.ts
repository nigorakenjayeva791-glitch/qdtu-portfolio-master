import { apiClient } from "@/api/client";
import { FILE } from "@/constants/apiEndpoint";
import type { FileUploadRespone } from "./file.type";

export const fileService = {
	uploadImage(file: File) {
		const formData = new FormData();
		formData.append("file", file);

		return apiClient.post<FileUploadRespone>(FILE.IMAGE, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	},
	uploadPdf(file: File) {
		const formData = new FormData();
		formData.append("file", file);

		return apiClient.post<FileUploadRespone>(FILE.PDF, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	},
};
