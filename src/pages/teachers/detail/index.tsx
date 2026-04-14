import { ChevronRight, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { useModalActions } from "@/store/modalStore";
import { NashrModal } from "./detail-modals/nashr-modal";
import { PublicationModal } from "./detail-modals/publication-modal";
import { ResearchModal } from "./detail-modals/research-modal";
import { MaslahatModal } from "./detail-modals/maslahat-modal";
import type { ProfileFormData } from "./detail-profile/profile-edit";
import { ProfileForm } from "./detail-profile/profile-form";
import { ProfileSidebar } from "./detail-profile/profile-sidebar";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/ui/button";
import { StatsGrid } from "./stats-grid";
import { useGetTeacherStats } from "@/hooks/teacher/useGetTeacherStats";
import { TableToolbar } from "@/components/table-toolbar/table-toolbar";
import { ActivityTabs } from "./activity-tabs";
import { useResearch } from "@/hooks/teacher/useResearch";
import { useNazorat } from "@/hooks/teacher/useNazorat";
import { useNashr } from "@/hooks/teacher/useNashr";
import { useMaslahat } from "@/hooks/teacher/useMaslahat";
import { useAward } from "@/hooks/teacher/useMukofot";
import { MukofotModal } from "./detail-modals/mukofot-modal";

export default function TeacherDetail() {
	const navigate = useNavigate();
	const location = useLocation();
	const { open } = useModalActions();

	// Teacher ma'lumotlarini olish
	const teacher = (location.state as { teacher?: TeacherProfile } | null)?.teacher ?? null;
	const { data: statsData, isLoading: statsLoading } = useGetTeacherStats(teacher?.id);

	const { data: researchData, isLoading: researchLoading } = useResearch(teacher.id);
	const { data: nazoratData, isLoading: nazoratLoading } = useNazorat(teacher.id);
	const { data: nashrData, isLoading: nashrLoading } = useNashr(teacher.id);
	const { data: maslahatData, isLoading: maslahatLoading } = useMaslahat(teacher.id);
	const { data: mukofotData, isLoading: mukofotLoading } = useAward(teacher.id);

	const research = researchData?.data;
	const nazorat = nazoratData?.data;
	const nashr = nashrData?.data;
	const maslahat = maslahatData?.data;
	const mukofot = mukofotData?.data;

	useEffect(() => {
		if (teacher) {
			document.title = `QDTU | ${teacher.fullName}`;
		}
	}, [teacher]);

	const [activeTab, setActiveTab] = useState("researches");

	// Pagination states
	const [researchPage, setResearchPage] = useState(0);
	const [nazoratPage, setNazoratPage] = useState(0);
	const [nashrlarPage, setNashrlarPage] = useState(0);
	const [maslahatlarPage, setMaslahatlarPage] = useState(0);

	if (!teacher) {
		return (
			<div className="flex flex-col items-center justify-center h-64 gap-3">
				<EmptyState
					title="O'qituvchi topilmadi"
					description="Ro'yxatga qaytib, o'qituvchini tanlang"
					icon={<GraduationCap className="size-5 text-muted-foreground" />}
				/>
				<Button variant="outline" size="sm" onClick={() => navigate("/teachers")}>
					Ro'yxatga qaytish
				</Button>
			</div>
		);
	}

	const profile: ProfileFormData = {
		fullName: teacher.fullName,
		email: teacher.email ?? "",
		age: teacher.age ? String(teacher.age) : "",
		phone: teacher.phoneNumber,
		department: teacher.departmentName,
		position: teacher.lavozim,
		bio: "",
		additionalInfo: "",
		specialty: teacher.profession ?? "",
		orcId: "",
		scopusId: "",
		scienceId: "",
		researcherId: "",
		image: null,
		resume: null,
	};

	const TOOLBAR_CONFIG = {
		researches: {
			addLabel: "Tadqiqot qo'shish",
			countLabel: "Tadqiqotlar",
			count: research?.totalElements,
			modalType: "research",
		},
		publications: {
			addLabel: "Nazorat qo'shish",
			countLabel: "Nazoratlar",
			count: nazorat?.totalElements,
			modalType: "nazorat",
		},
		supervision: {
			addLabel: "Nashr qo'shish",
			countLabel: "Nashrlar",
			count: nashr?.totalElements,
			modalType: "nashr",
		},
		activities: {
			addLabel: "Maslahat qo'shish",
			countLabel: "Maslahatlar",
			count: maslahat?.totalElements,
			modalType: "maslahat",
		},
		awards: {
			addLabel: "Mukofot qo'shish",
			countLabel: "Mukofotlar",
			count: mukofot?.totalElements,
			modalType: "mukofot",
		},
	} as const;

	const currentToolbar = TOOLBAR_CONFIG[activeTab as keyof typeof TOOLBAR_CONFIG];
	if (researchLoading) {
		return <div className="flex flex-col gap-4 sm:gap-5">ma'lumotlar yuklanmoqda !</div>;
	}

	return (
		<div className="flex flex-col gap-4 sm:gap-5">
			{/* Breadcrumb */}
			<div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
				<button
					type="button"
					onClick={() => navigate("/teachers")}
					className="hover:text-foreground transition-colors hover:underline underline-offset-4"
				>
					O'qituvchilar
				</button>
				<ChevronRight className="size-3.5 opacity-40" />
				<span className="text-foreground font-medium truncate max-w-[160px] sm:max-w-xs">{teacher.fullName}</span>
			</div>
			<div className="flex flex-col lg:flex-row gap-4 sm:gap-5 items-start">
				<ProfileSidebar profile={profile} imgUrl={teacher.imgUrl} />
				<div className="w-full lg:flex-1 min-w-0">
					<ProfileForm defaultValues={profile} />
				</div>
			</div>
			<TableToolbar
				addLabel={currentToolbar.addLabel}
				countLabel={currentToolbar.countLabel}
				count={currentToolbar.count}
				searchValue=""
				onSearchChange={() => {}}
				showSearch={false}
				onAdd={currentToolbar.modalType ? () => open({ _type: currentToolbar.modalType }) : undefined}
			/>
			<ActivityTabs
				activeTab={activeTab}
				onTabChange={setActiveTab}
				userId={teacher.id}
				// Research
				researches={research?.body ?? []}
				researchPage={research?.page ?? 0}
				researchTotalPage={research?.totalPage ?? 0}
				onResearchPageChange={setResearchPage}
				researchLoading={researchLoading}
				// Nashr
				nashrlar={nashr?.body ?? []}
				nashrlarPage={nashr?.page ?? 0}
				nashrlarTotalPage={nashr?.totalPage ?? 0}
				onNashrlarPageChange={setNashrlarPage}
				nashrlarLoading={nashrLoading}
				// Nazorat
				nazoratlar={nazorat?.body ?? []}
				nazoratPage={nazorat?.page ?? 0}
				nazoratTotalPage={nazorat?.totalPage ?? 0}
				onNazoratPageChange={setNazoratPage}
				nazoratLoading={nazoratLoading}
				// Maslahat
				maslahatlar={maslahat?.body ?? []}
				maslahatlarPage={maslahat?.page ?? 0}
				maslahatlarTotalPage={maslahat?.totalPage ?? 0}
				onMaslahatlarPageChange={setMaslahatlarPage}
				maslahatlarLoading={maslahatLoading}
				// Mukofot
				mukofotlar={mukofot?.body ?? []}
			/>
			<StatsGrid data={statsData} isLoading={statsLoading} />
			{/* Modallar */}
			<ResearchModal userId={teacher?.id} />
			<PublicationModal userId={teacher?.id}/>
			<NashrModal userId={teacher?.id} />
			<MaslahatModal userId={teacher?.id} />
			<MukofotModal userId={teacher?.id} />
		</div>
	);
}
