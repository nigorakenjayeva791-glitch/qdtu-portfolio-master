import { Loader2, MessageSquare, Plus } from "lucide-react";
import { useMaslahat } from "@/hooks/teacher/useMaslahat";
import { useUser } from "@/hooks/user/useUser";
import { MaslahatModal } from "@/pages/teachers/detail/detail-modals/maslahat-modal";
import { MaslahatTab } from "@/pages/teachers/detail/detail-tabs/maslahat-tab";
import { useModalActions } from "@/store/modalStore";
import { Button } from "@/ui/button";

export default function TeacherConsultations() {
	const { open } = useModalActions();
	const { data: teacher, isLoading: userLoading } = useUser();
	const { data, isLoading: maslahatLoading } = useMaslahat(teacher?.id);

	const isLoading = userLoading || maslahatLoading;

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
			{/* Yuqori Sarlavha va Action qismi */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background/50 backdrop-blur-md p-4 rounded-2xl border border-border/50 shadow-sm">
				<div>
					<h1 className="text-xl font-bold tracking-tight text-foreground">Maslahatlar</h1>
					<p className="text-sm text-muted-foreground">O'qituvchining barcha maslahat sessiyalari</p>
				</div>

				<Button
					onClick={() => open({ _type: "maslahat" })}
					className="group shadow-md hover:shadow-primary/20 transition-all duration-300"
				>
					<Plus className="mr-2 size-4 group-hover:rotate-90 transition-transform duration-300" />
					Maslahat qo'shish
				</Button>
			</div>

			{/* Asosiy Jadval Konteyneri */}
			<div className="rounded-xl border bg-card text-card-foreground shadow-sm transition-all overflow-x-auto">
				<div className="p-4 sm:p-6">
					{data?.data.body && data.data.body.length > 0 ? (
						<MaslahatTab isLoading={maslahatLoading} page={data.data.page} userId={teacher?.id} data={data.data.body} />
					) : (
						<div className="py-20 text-center flex flex-col items-center opacity-50">
							<div className="size-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
								<MessageSquare className="size-8" />
							</div>
							<p className="text-lg font-medium">Hozircha hech qanday maslahat yo'q</p>
							<p className="text-sm">Yangi maslahat qo'shish uchun tugmani bosing</p>
						</div>
					)}
				</div>
			</div>

			<MaslahatModal userId={teacher?.id} />
		</div>
	);
}
