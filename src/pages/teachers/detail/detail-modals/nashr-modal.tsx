import { FileInput } from "@/components/file-input/file-input";
import { Modal } from "@/components/modal/modal";
import { useCreateNashr } from "@/hooks/teacher/useCreateNashr";
import { useEditNashr } from "@/hooks/teacher/useEditNashr";
import { fileService } from "@/features/file/file.service";
import { useModalActions, useModalEditData, useModalIsOpen } from "@/store/modalStore";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Textarea } from "@/ui/textarea";
import { Checkbox } from "@/ui/checkbox"; // Shadcn Checkbox ishlatsangiz bo'ladi
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
	BookOpen,
	AlignLeft,
	Calendar,
	Building2,
	FileText,
	UserCheck,
	Globe2,
	Hash,
	FileUp,
	Plus,
	Pencil,
	Star,
} from "lucide-react";

export function NashrModal({ userId }: { userId: number }) {
	const isOpen = useModalIsOpen();
	const editData = useModalEditData();
	const { close } = useModalActions();
	const { mutateAsync: createNashr, isPending: isCreating } = useCreateNashr();
	const { mutateAsync: editNashr, isPending: isEditing } = useEditNashr();

	const visible = isOpen && editData?._type === "nashr";
	const isEdit = visible && !!editData?.id;
	const isPending = isCreating || isEditing;

	const { register, handleSubmit, control, reset } = useForm();

	useEffect(() => {
		if (visible) {
			reset(
				isEdit
					? {
							name: editData.name,
							description: editData.description,
							year: String(editData.year),
							institution: editData.organization,
							type: editData.type,
							author: editData.authorship,
							degree: editData.degree,
							volume: editData.volume,
							popular: editData.popular,
							pdf: null,
						}
					: {
							name: "",
							description: "",
							year: "",
							institution: "",
							type: "",
							author: "",
							degree: "",
							volume: "",
							popular: false,
							pdf: null,
						},
			);
		}
	}, [visible, isEdit, editData, reset]);

	const onSubmit = async (data: any) => {
		let fileUrl = editData?.fileUrl || "";
		if (data.pdf) {
			const uploaded = await fileService.uploadPdf(data.pdf);
			fileUrl = uploaded.url;
		}

		const payload = {
			...data,
			year: Number(data.year),
			fileUrl,
			userId,
		};

		isEdit ? await editNashr({ id: editData.id, ...payload }) : await createNashr(payload);
		close();
	};

	return (
		<Modal
			open={visible}
			onClose={close}
			title={
				<div className="flex items-center gap-2">
					{isEdit ? <Pencil className="w-5 h-5 text-blue-500" /> : <BookOpen className="w-5 h-5 text-indigo-500" />}
					<span>{isEdit ? "Nashrni tahrirlash" : "Yangi nashr qo'shish"}</span>
				</div>
			}
		>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-5 py-2 max-h-[75vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300"
			>
				<div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border/50">
					<div className="grid gap-1.5">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<BookOpen className="w-4 h-4 text-muted-foreground" /> Nashr nomi
						</Label>
						<Input
							placeholder="Nashr nomini kiriting..."
							{...register("name", { required: true })}
							className="bg-background"
						/>
					</div>
					<div className="grid gap-1.5">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<AlignLeft className="w-4 h-4 text-muted-foreground" /> Tavsif
						</Label>
						<Textarea
							placeholder="Qisqacha..."
							className="min-h-[60px] resize-none bg-background"
							{...register("description")}
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<div className="grid gap-1.5">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<Calendar className="w-4 h-4 text-muted-foreground" /> Yil
						</Label>
						<Input type="number" placeholder="2024" {...register("year")} className="bg-background" />
					</div>
					<div className="grid gap-1.5">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<Building2 className="w-4 h-4 text-muted-foreground" /> Tashkilot
						</Label>
						<Input placeholder="Tashkilot..." {...register("institution")} className="bg-background" />
					</div>
					<div className="grid gap-1.5">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<FileText className="w-4 h-4 text-muted-foreground" /> Turi
						</Label>
						<Controller
							name="type"
							control={control}
							render={({ field }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger className="bg-background">
										<SelectValue placeholder="Tanlang" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="ARTICLE">Maqola</SelectItem>
										<SelectItem value="BOOK">Kitob</SelectItem>
										<SelectItem value="PROCEEDING">Tadqiqot</SelectItem>
										<SelectItem value="OTHERS">Boshqa</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>
					<div className="grid gap-1.5">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<UserCheck className="w-4 h-4 text-muted-foreground" /> Mualliflik
						</Label>
						<Controller
							name="author"
							control={control}
							render={({ field }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger className="bg-background">
										<SelectValue placeholder="Tanlang" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="FIRST_AUTHOR">Asosiy muallif</SelectItem>
										<SelectItem value="COAUTHOR">Hammuallif</SelectItem>
										<SelectItem value="BOTH_AUTHOR">Boshqa</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>
					<div className="grid gap-1.5">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<Globe2 className="w-4 h-4 text-muted-foreground" /> Daraja
						</Label>
						<Controller
							name="degree"
							control={control}
							render={({ field }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger className="bg-background">
										<SelectValue placeholder="Tanlang" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="INTERNATIONAL">Xalqaro</SelectItem>
										<SelectItem value="NATIONAL">Mahalliy</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>
					<div className="grid gap-1.5">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<Hash className="w-4 h-4 text-muted-foreground" /> Jild (Volume)
						</Label>
						<Input placeholder="Vol. 12..." {...register("volume")} className="bg-background" />
					</div>
				</div>

				<div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg border border-border/50">
					<Controller
						name="popular"
						control={control}
						render={({ field }) => (
							<input
								type="checkbox"
								id="nashr-popular"
								checked={field.value}
								onChange={(e) => field.onChange(e.target.checked)}
								className="w-4 h-4 accent-primary"
							/>
						)}
					/>
					<Label htmlFor="nashr-popular" className="flex items-center gap-2 cursor-pointer select-none">
						<Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Ommabop nashr (Popular)
					</Label>
				</div>

				<div className="grid gap-2 p-4 rounded-xl border-2 border-dashed border-muted-foreground/20">
					<Label className="flex items-center gap-2 text-sm font-medium">
						<FileUp className="w-4 h-4 text-primary" /> Nashr PDF
					</Label>
					<Controller
						name="pdf"
						control={control}
						render={({ field }) => (
							<FileInput type="document" accept=".pdf" value={field.value} onChange={field.onChange} />
						)}
					/>
				</div>

				<div className="flex items-center justify-end gap-3 pt-4 border-t">
					<Button type="button" variant="ghost" onClick={close}>
						Bekor qilish
					</Button>
					<Button type="submit" disabled={isPending}>
						{isPending ? "Saqlanmoqda..." : "Saqlash"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
