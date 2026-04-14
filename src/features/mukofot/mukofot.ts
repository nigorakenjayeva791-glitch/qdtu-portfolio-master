export interface MukofotItem {
  id: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  awardEnum: "Trening_Va_Amaliyot" | "SERTIFIKAT" | "DIPLOM";
  memberEnum: "XALQARO" | "MILLIY";
}

interface MukofotData {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: MukofotItem[];
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: MukofotData;
}
interface PaginationData<T> {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: T;
}

export interface GetbyIdResponse {
  success: boolean;
  message: string;
  data: PaginationData<MukofotItem>;
}

// Azolik turlari uchun enum
enum MemberType {
  MILLIY = "MILLIY",
  XALQARO = "XALQARO"
}

enum AwardType {
  TRENING_VA_AMALIYOT = "Trening_Va_Amaliyot",
  TAHRIRIYAT_KENGASHIGA_AZOLIK = "Tahririyat_Kengashiga_Azolik",
  MAXSUS_KENGASH_AZOLIGI = "Maxsus_Kengash_Azoligi",
  PATENT_DGU = "Patent_Dgu",
  DAVLAT_MUKOFOTI = "Davlat_Mukofoti"
}

// Asosiy ma'lumotlar interfeysi
export interface AwardRequest {
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  awardEnum: AwardType;
  memberEnum: MemberType;
}