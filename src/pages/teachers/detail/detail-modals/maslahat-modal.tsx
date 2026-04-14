import { FileInput } from "@/components/file-input/file-input";
import { Modal } from "@/components/modal/modal";
import { useCreateMaslahat } from "@/hooks/teacher/useCreateMahlahat";
import { useEditMaslahat } from "@/hooks/teacher/useEditMaslahat";
import { fileService } from "@/features/file/file.service";
import { useModalActions, useModalEditData, useModalIsOpen } from "@/store/modalStore";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Textarea } from "@/ui/textarea";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

type MaslahatFormData = {
	name: string;
	description: string;
	year: string;
	member: boolean | "";
	finishedEnum: "COMPLETED" | "IN_PROGRESS" | "FINISHED" | "";
	leader: string;
	pdf: File | null;	
};

type MaslahatModalProps = {
	userId: number;
};

export function MaslahatModal({ userId }: MaslahatModalProps) {
	const isOpen = useModalIsOpen();
	const editData = useModalEditData();
	const { close } = useModalActions();
	const { mutateAsync: createMaslahat, isPending: isCreating } = useCreateMaslahat();
	const { mutateAsync: editMaslahat, isPending: isEditing } = useEditMaslahat();

	const visible = isOpen && editData?._type === "maslahat";
	const isEdit = visible && !!editData?.id;
	const isPending = isCreating || isEditing;

	const { register, handleSubmit, control, reset } = useForm<MaslahatFormData>({
		defaultValues: {
			name: "",
			description: "",
			year: "",
			member: "",
			finishedEnum: "",
			leader: "",
			pdf: null,
		},
	});

	useEffect(() => {
		if (visible && isEdit) {
			reset({
				name: editData.name ?? "",
				description: editData.description ?? "",
				year: String(editData.year ?? ""),
				member: editData.member ?? "",
				finishedEnum: editData.finishedEnum ?? "",
				leader: editData.leader ?? "",
				pdf: null,
			});
		} else if (visible && !isEdit) {
			reset({
				name: "",
				description: "",
				year: "",
				member: "",
				finishedEnum: "",
				leader: "",
				pdf: null,
			});
		}
	}, [visible, isEdit, editData, reset]);

	const handleClose = () => {
		reset();
		close();
	};

	const onSubmit = async (data: MaslahatFormData) => {
		let fileUrl = "";
		if (data.pdf) {
			const uploaded = await fileService.uploadPdf(data.pdf);
			fileUrl = uploaded.url;
		}

		const payload = {
			name: data.name,
			description: data.description,
			year: Number(data.year),
			member: data.member as boolean,
			finishedEnum: data.finishedEnum as "COMPLETED" | "IN_PROGRESS" | "FINISHED",
			leader: data.leader,
			fileUrl,
			userId,
		};

		if (isEdit) {
			await editMaslahat({ id: editData.id, ...payload, fileUrl: fileUrl || editData.fileUrl || "" });
		} else {
			await createMaslahat(payload);
		}

		handleClose();
	};

	return (
		<Modal open={visible} onClose={handleClose} title={isEdit ? "Maslahatni tahrirlash" : "Maslahat qo'shish"}>
			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<Label htmlFor="m-name">Maslahat nomi</Label>
					<Input id="m-name" placeholder="Nomni kiriting..." {...register("name")} />
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="m-desc">Qisqa tavsif</Label>
					<Textarea id="m-desc" placeholder="Tavsif..." className="min-h-[80px] resize-none" {...register("description")} />
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor="m-year">Yil</Label>
						<Input id="m-year" type="number" placeholder="2024" {...register("year")} />
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="m-leader">Rahbar</Label>
						<Input id="m-leader" placeholder="Rahbar ismi..." {...register("leader")} />
					</div>

					<div className="flex flex-col gap-2">
						<Label>A'zolik</Label>
						<Controller
							name="member"
							control={control}
							render={({ field }) => (
								<Select
									value={field.value === "" ? "" : String(field.value)}
									onValueChange={(val) => field.onChange(val === "true")}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Tanlang" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="true">Ha</SelectItem>
										<SelectItem value="false">Yo'q</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<Label>Holat</Label>
						<Controller
							name="finishedEnum"
							control={control}
							render={({ field }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Tanlang" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="COMPLETED">Tugallangan</SelectItem>
										<SelectItem value="IN_PROGRESS">Jarayonda</SelectItem>
										<SelectItem value="FINISHED">Yakunlangan</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<Label>
						PDF yuklash <span className="text-muted-foreground font-normal">(ixtiyoriy)</span>
					</Label>
					<Controller
						name="pdf"
						control={control}
						render={({ field }) => (
							<FileInput type="document" accept=".pdf" value={field.value} onChange={field.onChange} />
						)}
					/>
				</div>

				<div className="flex items-center justify-end gap-2 pt-2">
					<Button type="button" variant="outline" onClick={handleClose}>
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