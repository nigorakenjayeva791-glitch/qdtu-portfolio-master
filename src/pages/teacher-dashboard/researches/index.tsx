import { Loader2, Plus, Sparkles } from "lucide-react";
import { useResearch } from "@/hooks/teacher/useResearch";
import { useUser } from "@/hooks/user/useUser";
import { ResearchModal } from "@/pages/teachers/detail/detail-modals/research-modal";
import { ResearchesTab } from "@/pages/teachers/detail/detail-tabs/researches-tab";
import { useModalActions } from "@/store/modalStore";
import { Button } from "@/ui/button";

export default function TeacherResearches() {
	const { open } = useModalActions();
	const { data: teacher, isLoading: userLoading } = useUser();
	const { data: researchData, isLoading: researchLoading } = useResearch(teacher?.id);

	const isLoading = userLoading || researchLoading;

	if (isLoading) {
		return (
			<div className="w-full h-[60vh] flex flex-col items-center justify-center gap-3 animate-in fade-in duration-500">
				<Loader2 className="size-10 text-primary animate-spin" />
				<p className="text-muted-foreground animate-pulse text-sm font-medium">Ma'lumotlar yuklanmoqda...</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6 p-1 sm:p-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background/50 backdrop-blur-md p-4 rounded-2xl border border-border/50 shadow-sm">
				<div>
					<h1 className="text-xl font-bold tracking-tight text-foreground">Tadqiqotlar</h1>
					<p className="text-sm text-muted-foreground">O'qituvchining barcha tadqiqot ishlarining to'liq ro'yxati</p>
				</div>

				<Button
					onClick={() => open({ _type: "research" })}
					className="group shadow-md hover:shadow-primary/20 transition-all duration-300"
				>
					<Plus className="mr-2 size-4 group-hover:rotate-90 transition-transform duration-300" />
					Tadqiqot qo'shish
				</Button>
			</div>

			{/* Asosiy Jadval Konteyneri */}
			<div className="rounded-xl border bg-card text-card-foreground shadow-sm transition-all">
				<div className="p-4 sm:p-6">
					{researchData?.data.body && researchData.data.body.length > 0 ? (
						<ResearchesTab data={researchData.data.body} />
					) : (
						<div className="py-20 text-center flex flex-col items-center opacity-50">
							<div className="size-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
								<Sparkles className="size-8" />
							</div>
							<p className="text-lg font-medium">Hozircha hech qanday tadqiqot yo'q</p>
							<p className="text-sm">Yangi tadqiqot qo'shish uchun tugmani bosing</p>
						</div>
					)}
				</div>
			</div>

			<ResearchModal userId={teacher?.id} />
		</div>
	);
}
