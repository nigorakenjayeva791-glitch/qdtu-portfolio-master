// ============ BASE TYPES ============
export interface Teacher {
  id: number;
  fullName: string;
  phoneNumber: string;
  email?: string | null;
  age: number;
  gender: boolean;
  profession: string | null;
  imgUrl: string | null;
  biography?: string;
  lavozmId: number;
  lavozim: string;
  departmentId: number;
  departmentName: string;
  orcId?: string;
  scopusId?: string;
  scienceId?: string;
  researcherId?: string;
  fileUrl?: string;
}

export interface TeacherDetail extends Teacher {
  biography: string;
  orcId: string;
  scopusId: string;
  scienceId: string;
  researcherId: string;
  fileUrl: string;
}

// ============ SEARCH & LIST ============
export interface SearchParams {
  name: string;
  college: string;
  lavozim: string;
  page: number;
  size: number;
  sort?: string; 
}

export interface TeacherListData {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: Teacher[];
}

export interface GetTeacherListResponse {
  success: boolean;
  message: string;
  data: TeacherListData;
}

export interface GetTeacherByIdResponse {
  success: boolean;
  message: string;
  data: TeacherDetail;
}

// ============ CREATE ============
export interface CreateTeacherRequest {
  fullName: string;
  phoneNumber: string;
  email?: string;
  imgUrl: string;
  lavozmId: number;
  gender: boolean;
  password: string;
  departmentId: number;
}

export interface CreateTeacherParams {
  fullName: string;
  phoneNumber: string;
  email?: string;
  imgUrl: File | null;
  lavozmId: number;
  gender: boolean;
  password: string;
  departmentId: number;
}

export interface CreateTeacherResponse {
  success: boolean;
  message: string;
  data: string;
}

// ============ EDIT (short update) ============
export interface EditTeacherRequest {
  fullName: string;
  phoneNumber: string;
  email?: string;
  imgUrl: string | null;
  lavozmId: number;
  gender: boolean;
  departmentId: number;
}

export interface EditTeacherParams {
  id:number;
  fullName: string;
  phoneNumber: string;
  imgUrl: File | null;
  lavozmId: number;
  gender: boolean;
  departmentId: number;
  password:string
}

export interface EditTeacherResponse {
  success: boolean;
  message: string;
  data: string;
}

// ============ UPDATE (full update) ============
export interface UpdateTeacherRequest {
  fullName: string;
  phoneNumber: string;
  email?: string;
  biography: string;
  age: number;
  orcId: string;
  scopusId: string;
  scienceId: string;
  researcherId: string;
  gender: boolean;
  profession: string;
  imgUrl: string;
  fileUrl: string;
  lavozmId: number;
  departmentId: number;
}

export interface UpdateTeacherParams {
  fullName: string;
  phoneNumber: string;
  email?: string;
  biography: string;
  age: number;
  orcId: string;
  scopusId: string;
  scienceId: string;
  researcherId: string;
  gender: boolean;
  profession: string;
  imgUrl: File | null;
  fileUrl: File | null;
  lavozmId: number;
  departmentId: number;
}

export interface UpdateTeacherResponse {
  success: boolean;
  message: string;
  data: string;
}

// ============ DELETE ============
export interface DeleteTeacherResponse {
  success: boolean;
  message: string;
  data: string;
}

export interface TeacherProfile {
  id: number;
  fullName: string;
  age: number;
  email?: string | null;
  phoneNumber: string;
  gender: boolean;
  departmentName: string;
  lavozim: string;
  profession: string | null;
  imgUrl: string;
  input: string | null;
}
export interface TeacherStatsData {
 tadqiqotlar: number;
 nashrlar: number;
 maqolalar: number;
 kitoblar: number;
 ishYuritishlar: number;
 boshqalar: number;
 nazorat: number;
 maslahatlar: number;
 mukofotlar: number;
 treninglar: number;
 tahririyatAzolik: number;
 maxsusKengash: number;
 patentlar: number;
 davlatMukofotlari: number;
}

export interface TeacherStatsResponse {
 success: boolean;
 message: string;
 data: TeacherStatsData;
}