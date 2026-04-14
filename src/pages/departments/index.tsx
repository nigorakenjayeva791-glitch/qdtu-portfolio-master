import { ConfirmPopover } from "@/components/confirm-popover/confirm-popover";
import { DataTable } from "@/components/data-table/data-table";
import type { ColumnDef } from "@/components/data-table/data-table";
import { FileInput } from "@/components/file-input/file-input";
import { Modal } from "@/components/modal/modal";
import { SearchableSelect } from "@/components/searchable-select/searchable-select";
import { TableToolbar } from "@/components/table-toolbar/table-toolbar";
import { useModalActions, useModalIsOpen, useModalEditData } from "@/store/modalStore";
import { useCreateDepartment } from "@/hooks/department/useCreateDepartment";
import { useDepartment } from "@/hooks/department/useDepartment";
import { useDeleteDepartment } from "@/hooks/department/useDeleteDepartment";
import { useUpdateDepartment } from "@/hooks/department/useEditDepartment";
import { useCollage } from "@/hooks/collage/useCollage";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import type { Department } from "@/features/departments/department.type";

type DepartmentFormValues = {
	name: string;
	departmentId: string | number;
	image: File | null;
};

function createColumns(
	onEdit: (row: Department) => void,
	onDelete: (row: Department) => void,
	page: number,
	onImageClick: (imageUrl: string) => void,
	facultyMap: Record<number, string>,
): ColumnDef<Department>[] {
	return [
		{
			accessorKey: "id",
			header: "#",
			cell: ({ row }) => (
				<span className="text-muted-foreground">{page * 10 + row.index + 1}</span>
			),
		},
		{
			accessorKey: "imgUrl",
			header: "Rasm",
			cell: ({ row }) => {
				const imgUrl = row.original.imgUrl;
				return imgUrl ? (
					<img
						src={imgUrl}
						alt={row.original.name}
						className="w-9 h-9 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
						onClick={() => onImageClick(imgUrl)}
					/>
				) : (
					<div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-[13px]">
						{row.original.name.charAt(0).toUpperCase()}
					</div>
				);
			},
		},
		{
			accessorKey: "name",
			header: "Kafedra",
			cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
		},
		{
			accessorKey: "collegeId",
			header: "Fakulteti",
			cell: ({ row }) => {
				const collegeId = row.original.collegeId;
				const facultyName = facultyMap[collegeId] ?? "—";
				return <span className="font-medium">{facultyName}</span>;
			},
		},
		{
			id: "actions",
			header: () => <div className="text-center">Amallar</div>,
			cell: ({ row }) => (
				<div className="flex items-center justify-center gap-2">
					<button
						type="button"
						onClick={() => onEdit(row.original)}
						className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-[12px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
					>
						<Pencil className="size-3" />
						Tahrirlash
					</button>
					<ConfirmPopover onConfirm={() => onDelete(row.original)}>
						<button
							type="button"
							className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-[12px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
						>
							<Trash2 className="size-3" />
							O'chirish
						</button>
					</ConfirmPopover>
				</div>
			),
		},
	];
}

export default function Departments() {
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [searchParams, setSearchParams] = useSearchParams();
	const page = Number(searchParams.get("page") ?? 0);
	const search = searchParams.get("name") ?? "";

	const setPage = (newPage: number) => {
		setSearchParams((prev) => {
			const next = new URLSearchParams(prev);
			next.set("page", String(newPage));
			return next;
		});
	};

	const setSearch = (value: string) => {
		setSearchParams((prev) => {
			const next = new URLSearchParams(prev);
			if (value) next.set("name", value);
			else next.delete("name");
			next.set("page", "0");
			return next;
		});
	};

	const isOpen = useModalIsOpen();
	const editData = useModalEditData() as Department | null;
	const { open, close } = useModalActions();
	const isEdit = editData !== null;

	const { data: departmentResponse, isLoading, refetch } = useDepartment();
	const { mutate: createDepartment, isPending: isCreating } = useCreateDepartment();
	const { mutate: deleteDepartment } = useDeleteDepartment();
	const { mutate: updateDepartment, isPending: isUpdating } = useUpdateDepartment();
	const isPending = isCreating || isUpdating;

	const { data: collageResponse } = useCollage();

	const facultyOptions = useMemo(
		() =>
			(collageResponse?.data ?? []).map((f) => ({
				value: String(f.id),
				label: f.name,
			})),
		[collageResponse],
	);

	// id -> name map, kolonnada fakultet nomini ko'rsatish uchun
	const facultyMap = useMemo(() => {
		const map: Record<number, string> = {};
		(collageResponse?.data ?? []).forEach((f) => {
			map[f.id] = f.name;
		});
		return map;
	}, [collageResponse]);

	const departments: Department[] = departmentResponse?.data ?? [];
	const filteredDepartments = departments.filter(
		(d) =>
			d.name.toLowerCase().includes(search.toLowerCase()) ||
			d.imgUrl?.toLowerCase().includes(search.toLowerCase()),
	);
	const totalElements = filteredDepartments.length;
	const totalPage = Math.ceil(totalElements / 10);

	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors },
	} = useForm<DepartmentFormValues>({
		defaultValues: { name: "", departmentId: "", image: null },
	});

	useEffect(() => {
		if (editData) {
			reset({
				name: editData.name,
				departmentId: editData.collegeId ? String(editData.collegeId) : "",
				image: null,
			});
		} else {
			reset({ name: "", departmentId: "", image: null });
		}
	}, [editData, reset]);

	const columns = useMemo(
		() =>
			createColumns(
				(row) => open(row),
				(row) => deleteDepartment(row.id, { onSuccess: () => refetch() }),
				page,
				setPreviewImage,
				facultyMap,
			),
		[open, deleteDepartment, page, refetch, facultyMap],
	);

	const handleClose = () => {
		reset();
		close();
	};

	const onSubmit = (values: DepartmentFormValues) => {
		if (isEdit && editData) {
			const data: any = {
				name: values.name,
				departmentId: Number(values.departmentId),
			};
			if (values.image) data.image = values.image;
			updateDepartment(
				{ id: editData.id, collegeId: Number(values.departmentId), data },
				{
					onSuccess: () => {
						handleClose();
						refetch();
					},
				},
			);
			return;
		}

		if (!values.image) return;
		if (!values.departmentId) return;

		createDepartment(
			{
				name: values.name,
				collegeId: Number(values.departmentId),
				image: values.image,
			},
			{
				onSuccess: () => {
					handleClose();
					refetch();
				},
			},
		);
	};

	return (
		<div className="flex flex-col gap-4">
			<TableToolbar
				countLabel="Kafedralar soni"
				count={totalElements}
				searchValue={search}
				onSearchChange={setSearch}
				onAdd={() => open()}
				addLabel="Kafedra qo'shish"
			/>

			<DataTable
				columns={columns}
				data={filteredDepartments.slice(page * 10, page * 10 + 10)}
				isLoading={isLoading}
				page={page}
				totalPage={totalPage}
				onPageChange={setPage}
			/>

			{previewImage && (
				<button
					type="button"
					className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 cursor-pointer w-full border-0"
					onClick={() => setPreviewImage(null)}
				>
					<div
						role="dialog"
						aria-modal="true"
						aria-label="Image preview"
						className="relative flex items-center justify-center"
						onClick={(e) => e.stopPropagation()}
					>
						<img src={previewImage} alt="Preview" className="w-96 h-96 rounded-full object-cover shadow-lg" />
					</div>
				</button>
			)}

			<Modal
				open={isOpen}
				onClose={handleClose}
				title={isEdit ? "Kafedrani tahrirlash" : "Kafedra qo'shish"}
			>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 py-2">
					<div className="flex flex-col gap-2">
						<Label>Rasm</Label>
						<Controller
							name="image"
							control={control}
							rules={{ required: !isEdit && "Rasm tanlanishi shart" }}
							render={({ field }) => (
								<FileInput type="image" value={field.value} onChange={field.onChange} />
							)}
						/>
						{errors.image && (
							<span className="text-[12px] text-red-500">{errors.image.message}</span>
						)}
					</div>

					<div className="flex flex-col gap-2">
						<Label>Fakultet</Label>
						<Controller
							name="departmentId"
							control={control}
							rules={{ required: "Fakultet tanlanishi shart" }}
							render={({ field }) => (
								<SearchableSelect
									options={facultyOptions}
									value={field.value}
									onChange={field.onChange}
									placeholder="Fakultetni tanlang"
									searchPlaceholder="Fakultet qidirish..."
								/>
							)}
						/>
						{errors.departmentId && (
							<span className="text-[12px] text-red-500">{errors.departmentId.message}</span>
						)}
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="department-name">Kafedra nomi</Label>
						<Input
							id="department-name"
							placeholder="Masalan: Farmatsiya va kimyo kafedrasi"
							{...register("name", { required: "Kafedra nomi kiritilishi shart" })}
						/>
						{errors.name && (
							<span className="text-[12px] text-red-500">{errors.name.message}</span>
						)}
					</div>

					<div className="flex justify-end gap-2">
						<Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
							Bekor qilish
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending ? "Yuklanmoqda..." : isEdit ? "Saqlash" : "Qo'shish"}
						</Button>
					</div>
				</form>
			</Modal>
		</div>
	);
}