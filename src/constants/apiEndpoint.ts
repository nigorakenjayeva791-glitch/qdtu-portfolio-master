const API_ENDPOINTS = {
	LOGIN: "/auth/login",
	USER: {
		USER_ME: "/user",
	},
	FILE: {
		IMAGE: "/api/v1/files",
		PDF: "/api/v1/files/pdf",
	},
	COLLAGE: {
		GETALL: "/college",
		CREATE: "college",
		DELETE: "/college",
		UPDATE: "/college",
	},
	DEPARTMENT: {
		CREATE: "/department",
		DELETE: "/department",
		UPDATE: "/department",
		PAGE: "/department/page",
		LIST: "/department/list",
	},
	POSITION: {
		LAVOZIM: "/lavozim",
		STATISTIC: "/lavozim/get-lavozim-statistiks",
	},
	TEACHER: {
		SEARCH: "/teacher/search",
		DELETE: "/teacher",
		CREATE: "/teacher/saveUser",
		EDIT: "/teacher/edit",
	},
	USER_STATISTICS: "/user/statistics",
	RESEARCH: {
		GETBYID: "/research/byUser",
		DELETE:"/research"
	},
	NAZORAT: {
		GETBYID: "/nazorat/byUser",
		DELETE:"/nazorat"
	},
	NASHR: {
		GETBYID: "/api/publication/byUser",
		DELETE:"/api/publication"
	},
	MASLAHAT: {
		GETBYID: "/api/consultation/byUser",
		DELETE:"/api/consultation"
	},
	MUKOFOT: {
		GETBYID: "/award/byUser",
		DELETE:"/award"
	},
};

export const {
	LOGIN,
	USER,
	FILE,
	COLLAGE,
	DEPARTMENT,
	POSITION,
	TEACHER,
	USER_STATISTICS,
	RESEARCH,
	MASLAHAT,
	MUKOFOT,
	NASHR,
	NAZORAT,
} = API_ENDPOINTS;
