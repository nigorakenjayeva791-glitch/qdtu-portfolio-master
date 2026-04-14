import { FileInput } from "@/components/file-input/file-input";
import { Modal } from "@/components/modal/modal";
import { fileService } from "@/features/file/file.service";
import { useCreateMukofot } from "@/hooks/teacher/useCreateMukofot";
import { useEditMukofot } from "@/hooks/teacher/useEditMukofot";
import { useModalActions, useModalEditData, useModalIsOpen } from "@/store/modalStore";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Textarea } from "@/ui/textarea";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Trophy, AlignLeft, Calendar, Globe2, Medal, FileUp, Plus, Pencil } from "lucide-react";

enum MemberType {
	MILLIY = "MILLIY",
	XALQARO = "XALQARO",
}
enum AwardType {
	TRENING_VA_AMALIYOT = "Trening_Va_Amaliyot",
	TAHRIRIYAT_KENGASHIGA_AZOLIK = "Tahririyat_Kengashiga_Azolik",
	MAXSUS_KENGASH_AZOLIGI = "Maxsus_Kengash_Azoligi",
	PATENT_DGU = "Patent_Dgu",
	DAVLAT_MUKOFOTI = "Davlat_Mukofoti",
}

export function MukofotModal({ userId }: { userId: number }) {
	const isOpen = useModalIsOpen();
	const editData = useModalEditData();
	const { close } = useModalActions();
	const { mutateAsync: createMukofot, isPending: isCreating } = useCreateMukofot();
	const { mutateAsync: editMukofot, isPending: isEditing } = useEditMukofot();

	const visible = isOpen && editData?._type === "mukofot";
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
							awardEnum: editData.awardEnum,
							memberEnum: editData.memberEnum,
							pdf: null,
						}
					: { name: "", description: "", year: "", awardEnum: "", memberEnum: "", pdf: null },
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
			name: data.name,
			description: data.description,
			year: Number(data.year),
			awardEnum: data.awardEnum,
			memberEnum: data.memberEnum,
			fileUrl,
			userId,
		};

		isEdit ? await editMukofot({ id: editData.id, ...payload }) : await createMukofot(payload);
		close();
	};

	return (
		<Modal
			open={visible}
			onClose={close}
			title={
				<div className="flex items-center gap-2">
					{isEdit ? <Pencil className="w-5 h-5 text-blue-500" /> : <Trophy className="w-5 h-5 text-yellow-500" />}
					<span>{isEdit ? "Mukofotni tahrirlash" : "Mukofot qo'shish"}</span>
				</div>
			}
		>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-5 py-2 max-h-[75vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300"
			>
				<div className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border/50">
					<div className="grid gap-2">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<Trophy className="w-4 h-4 text-muted-foreground" />
							Mukofot nomi
						</Label>
						<Input
							placeholder="Mukofot nomini kiriting..."
							{...register("name", { required: true })}
							className="bg-background"
						/>
					</div>
					<div className="grid gap-2">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<AlignLeft className="w-4 h-4 text-muted-foreground" />
							Tavsif
						</Label>
						<Textarea
							placeholder="Qisqacha tavsif..."
							className="min-h-[80px] resize-none bg-background"
							{...register("description")}
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="grid gap-2">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<Calendar className="w-4 h-4 text-muted-foreground" />
							Berilgan yili
						</Label>
						<Input type="number" placeholder="2024" {...register("year")} className="bg-background" />
					</div>
					<div className="grid gap-2">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<Globe2 className="w-4 h-4 text-muted-foreground" />
							Darajasi
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
										<SelectItem value={MemberType.MILLIY}>Milliy</SelectItem>
										<SelectItem value={MemberType.XALQARO}>Xalqaro</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>
					<div className="grid gap-2 col-span-full">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<Medal className="w-4 h-4 text-muted-foreground" />
							Mukofot turi
						</Label>
						<Controller
							name="awardEnum"
							control={control}
							render={({ field }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger className="bg-background">
										<SelectValue placeholder="Tanlang" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value={AwardType.TRENING_VA_AMALIYOT}>Trening va Amaliyot</SelectItem>
										<SelectItem value={AwardType.TAHRIRIYAT_KENGASHIGA_AZOLIK}>
											Tahririyat Kengashiga A'zolik
										</SelectItem>
										<SelectItem value={AwardType.MAXSUS_KENGASH_AZOLIGI}>Maxsus Kengash A'zoligi</SelectItem>
										<SelectItem value={AwardType.PATENT_DGU}>Patent DGU</SelectItem>
										<SelectItem value={AwardType.DAVLAT_MUKOFOTI}>Davlat Mukofoti</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>
				</div>

				<div className="grid gap-2 p-4 rounded-xl border-2 border-dashed border-muted-foreground/20">
					<Label className="flex items-center gap-2 text-sm font-medium">
						<FileUp className="w-4 h-4 text-primary" /> Tasdiqlovchi PDF
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
