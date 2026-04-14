import { FileInput } from "@/components/file-input/file-input";
import { Modal } from "@/components/modal/modal";
import { useCreateResearch } from "@/hooks/teacher/useCreateResearch";
import { useEditResearch } from "@/hooks/teacher/useEditResearch";
import { useModalActions, useModalEditData, useModalIsOpen } from "@/store/modalStore";
import { fileService } from "@/features/file/file.service";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Textarea } from "@/ui/textarea";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { BookOpen, Calendar, Building2, Globe2, CheckCircle2, FileUp, AlignLeft, Plus, Pencil } from "lucide-react"; // Ikonkalarni import qilamiz

type ResearchFormData = {
	name: string;
	description: string;
	year: string;
	univerName: string;
	memberEnum: "MILLIY" | "XALQARO" | "";
	status: "JARAYONDA" | "TUGALLANGAN" | "";
	pdf: File | null;
};

export function ResearchModal({ userId }: { userId: number }) {
	const isOpen = useModalIsOpen();
	const editData = useModalEditData();
	const { close } = useModalActions();
	const { mutateAsync: createResearch, isPending: isCreating } = useCreateResearch();
	const { mutateAsync: editResearch, isPending: isEditing } = useEditResearch();

	const visible = isOpen && (editData?._type === "research" || editData === "research");
	const isEdit = visible && !!editData?.id;
	const isPending = isCreating || isEditing;

	const { register, handleSubmit, control, reset } = useForm<ResearchFormData>();

	useEffect(() => {
		if (visible) {
			reset(
				isEdit
					? {
							name: editData.name,
							description: editData.description,
							year: String(editData.year),
							univerName: editData.univerName,
							memberEnum: editData.memberEnum,
							status: editData.finished ? "TUGALLANGAN" : "JARAYONDA",
							pdf: null,
						}
					: { name: "", description: "", year: "", univerName: "", memberEnum: "", status: "", pdf: null },
			);
		}
	}, [visible, isEdit, editData, reset]);

	const onSubmit = async (data: ResearchFormData) => {
		let fileUrl = editData?.fileUrl || "";
		if (data.pdf) {
			const uploaded = await fileService.uploadPdf(data.pdf);
			fileUrl = uploaded.url;
		}

		const payload = {
			name: data.name,
			description: data.description,
			year: Number(data.year),
			fileUrl,
			userId,
			member: true,
			univerName: data.univerName,
			finished: data.status === "TUGALLANGAN",
			memberEnum: data.memberEnum as "MILLIY" | "XALQARO",
		};

		isEdit ? await editResearch({ id: editData.id, ...payload }) : await createResearch(payload);
		close();
	};

	return (
		<Modal
			open={visible}
			onClose={close}
			title={
				<div className="flex items-center gap-2">
					{isEdit ? <Pencil className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-green-500" />}
					<span>{isEdit ? "Tadqiqotni tahrirlash" : "Yangi tadqiqot qo'shish"}</span>
				</div>
			}
		>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-5 py-2 max-h-[75vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300"
			>
				{/* Asosiy ma'lumotlar bloki */}
				<div className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border/50">
					<div className="grid gap-2">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<BookOpen className="w-4 h-4 text-muted-foreground" />
							Tadqiqot nomi
						</Label>
						<Input
							placeholder="Masalan: Sun'iy intellektning ta'limdagi o'rni"
							{...register("name", { required: true })}
							className="bg-background"
						/>
					</div>

					<div className="grid gap-2">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<AlignLeft className="w-4 h-4 text-muted-foreground" />
							Qisqa tavsif
						</Label>
						<Textarea
							placeholder="Tadqiqot maqsadlari va natijalari haqida..."
							className="min-h-[100px] resize-none bg-background"
							{...register("description")}
						/>
					</div>
				</div>

				{/* Detallar bloki */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="grid gap-2">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<Calendar className="w-4 h-4 text-muted-foreground" />
							Amalga oshirilgan yil
						</Label>
						<Input type="number" placeholder="2024" {...register("year")} className="bg-background" />
					</div>

					<div className="grid gap-2">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<Building2 className="w-4 h-4 text-muted-foreground" />
							Muassasa nomi
						</Label>
						<Input placeholder="Universitet yoki OTM..." {...register("univerName")} className="bg-background" />
					</div>

					<div className="grid gap-2">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<Globe2 className="w-4 h-4 text-muted-foreground" />
							A'zolik darajasi
						</Label>
						<Controller
							name="memberEnum"
							control={control}
							render={({ field }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger className="bg-background">
										<SelectValue placeholder="Tanlang" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="MILLIY">Milliy darajadagi</SelectItem>
										<SelectItem value="XALQARO">Xalqaro darajadagi</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>

					<div className="grid gap-2">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<CheckCircle2 className="w-4 h-4 text-muted-foreground" />
							Joriy holati
						</Label>
						<Controller
							name="status"
							control={control}
							render={({ field }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger className="bg-background">
										<SelectValue placeholder="Tanlang" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="JARAYONDA">Davom etmoqda</SelectItem>
										<SelectItem value="TUGALLANGAN">Yakunlangan</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>
				</div>

				{/* Fayl yuklash bloki */}
				<div className="grid gap-2 p-4 rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-colors">
					<Label className="flex items-center gap-2 text-sm font-medium mb-1">
						<FileUp className="w-4 h-4 text-primary" />
						Tasdiqlovchi hujjat (PDF)
					</Label>
					<Controller
						name="pdf"
						control={control}
						render={({ field }) => (
							<FileInput type="document" accept=".pdf" value={field.value} onChange={field.onChange} />
						)}
					/>
					<p className="text-[12px] text-muted-foreground italic text-center">Maksimal hajm 5MB, faqat PDF formatida</p>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-3 pt-4 border-t">
					<Button type="button" variant="ghost" onClick={close} className="px-6">
						Bekor qilish
					</Button>
					<Button
						type="submit"
						disabled={isPending}
						className="px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
					>
						{isPending ? "Saqlanmoqda..." : "Ma'lumotni saqlash"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
