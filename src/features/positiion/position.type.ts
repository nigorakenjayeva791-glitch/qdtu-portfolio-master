
export interface CreatePositionDTO {
	name: string;
}
export interface Position {
	id: number;
	name: string;
	totalEmployees: number;
}
export interface PositionCreateResponse {
	success: boolean;
	message: string;
	data: Position;
}