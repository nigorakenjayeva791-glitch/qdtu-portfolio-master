import { FileText, Save, User } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { FileInput } from "@/components/file-input/file-input";
import { SearchableSelect } from "@/components/searchable-select/searchable-select";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Separator } from "@/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Textarea } from "@/ui/textarea";
import { cn } from "@/utils";
import type { ProfileFormData } from "./profile-edit";

const POSITIONS_OPTIONS = [
	{ value: "1", label: "Professor" },
	{ value: "2", label: "Dotsent" },
	{ value: "3", label: "Katta o'qituvchi" },
	{ value: "4", label: "Assistent" },
	{ value: "5", label: "O'qituvchi" },
];

const DEPARTMENTS_OPTIONS = [
	{ value: "1", label: "Farmatsiya va kimyo kafedrasi" },
	{ value: "2", label: "Ichki kasalliklar kafedrasi" },
	{ value: "3", label: "Jarrohlik kafedrasi" },
	{ value: "4", label: "Bolalar kasalliklari kafedrasi" },
	{ value: "5", label: "Stomatologiya kafedrasi" },
	{ value: "6", label: "Akusherlik va ginekologiya" },
	{ value: "7", label: "Nevrologiya kafedrasi" },
	{ value: "8", label: "Biokimyo kafedrasi" },
	{ value: "9", label: "Fiziologiya kafedrasi" },
	{ value: "10", label: "Hamshiralik ishi kafedrasi" },
	{ value: "11", label: "Umumiy gigiyena kafedrasi" },
	{ value: "12", label: "Tibbiy biologiya kafedrasi" },
];

type ProfileFormProps = {
	defaultValues: ProfileFormData;
};

export function ProfileForm({ defaultValues }: ProfileFormProps) {
	const { register, control ,} = useForm<ProfileFormData>({
		defaultValues,
	});
  console.log();
  

	return (
		<div className="flex flex-col gap-4">
			{/* Header */}
			<div className="flex items-center justify-between gap-3">
				<div>
					<h1 className="text-[15px] sm:text-[16px] font-semibold">Profil ma'lumotlari</h1>
					<p className="text-[11px] sm:text-[12px] text-muted-foreground mt-0.5">Ma'lumotlarni ko'ring va tahrirlang</p>
				</div>
				<Button type="button" size="sm" className="gap-1.5 shrink-0">
					<Save className="size-4" />
					Saqlash
				</Button>
			</div>

			{/* Tabs */}
			<div className="rounded-xl border bg-card overflow-hidden">
				<Tabs defaultValue="main">
					<div className="border-b px-2 sm:px-4 overflow-x-auto">
						<TabsList className="bg-transparent h-auto p-0 rounded-none gap-0 justify-start min-w-max">
							{[
								{ value: "main", label: "Asosiy ma'lumotlar", icon: <User className="size-3.5" /> },
								{ value: "extra", label: "Qo'shimcha ma'lumotlar", icon: <FileText className="size-3.5" /> },
							].map((tab) => (
								<TabsTrigger
									key={tab.value}
									value={tab.value}
									className={cn(
										"rounded-none border-0 border-b-2 border-transparent px-3 sm:px-4 py-3 text-[12px] sm:text-[13px] gap-1.5 h-auto whitespace-nowrap",
										"data-[state=active]:border-primary data-[state=active]:bg-transparent dark:data-[state=active]:bg-transparent",
										"data-[state=active]:text-primary data-[state=active]:shadow-none",
									)}
								>
									{tab.icon}
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>
					</div>

					{/* Asosiy ma'lumotlar */}
					<TabsContent value="main" className="p-4 sm:p-5 mt-0">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="col-span-1 sm:col-span-2 flex flex-col gap-2">
								<Label htmlFor="fullName">To'liq ism</Label>
								<Input id="fullName" placeholder="Masalan: Aliyev Bobur Hamidovich" {...register("fullName")} />
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor="email">Email</Label>
								<Input id="email" type="email" placeholder="example@ttu.uz" {...register("email")} />
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor="age">Yosh</Label>
								<Input id="age" type="number" placeholder="45" {...register("age")} />
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor="phone">Telefon raqami</Label>
								<Input id="phone" placeholder="+998 (90) 000-00-00" {...register("phone")} />
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor="specialty">Mutaxassisligi</Label>
								<Input id="specialty" placeholder="Masalan: Jarrohlik..." {...register("specialty")} />
							</div>

							<div className="flex flex-col gap-2">
								<Label>Lavozim</Label>
								<Controller
									name="position"
									control={control}
									render={({ field }) => (
										<SearchableSelect
											options={POSITIONS_OPTIONS}
											value={field.value}
											onChange={field.onChange}
											placeholder="Lavozimni tanlang"
											searchPlaceholder="Lavozim qidirish..."
										/>
									)}
								/>
							</div>

							<div className="flex flex-col gap-2">
								<Label>Kafedra</Label>
								<Controller
									name="department"
									control={control}
									render={({ field }) => (
										<SearchableSelect
											options={DEPARTMENTS_OPTIONS}
											value={field.value}
											onChange={field.onChange}
											placeholder="Kafedrani tanlang"
											searchPlaceholder="Kafedra qidirish..."
										/>
									)}
								/>
							</div>

							<div className="col-span-1 sm:col-span-2">
								<Separator />
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor="orcId">ORC ID</Label>
								<Input id="orcId" placeholder="0000-0000-0000-0000" {...register("orcId")} />
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor="scopusId">Scopus ID</Label>
								<Input id="scopusId" placeholder="Masalan: 57210000000" {...register("scopusId")} />
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor="scienceId">Science ID</Label>
								<Input id="scienceId" placeholder="Masalan: A-1234-2020" {...register("scienceId")} />
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor="researcherId">Researcher ID</Label>
								<Input id="researcherId" placeholder="Masalan: A-1234-2020" {...register("researcherId")} />
							</div>
						</div>
					</TabsContent>

					{/* Qo'shimcha ma'lumotlar */}
					<TabsContent value="extra" className="p-4 sm:p-5 mt-0 flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="bio">Biografiya</Label>
							<Textarea
								id="bio"
								placeholder="Qisqacha biografiya..."
								className="min-h-[90px] resize-none"
								{...register("bio")}
							/>
						</div>

						<div className="flex flex-col gap-2">
							<Label htmlFor="additionalInfo">Qo'shimcha ma'lumot</Label>
							<Textarea
								id="additionalInfo"
								placeholder="Ilmiy yutuqlar, tajriba..."
								className="min-h-[70px] resize-none"
								{...register("additionalInfo")}
							/>
						</div>

						<Separator />

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="flex flex-col gap-2">
								<Label>Rasmi</Label>
								<Controller
									name="image"
									control={control}
									render={({ field }) => <FileInput type="image" value={field.value} onChange={field.onChange} />}
								/>
							</div>

							<div className="flex flex-col gap-2">
								<Label>Rezyume (PDF/DOCX)</Label>
								<Controller
									name="resume"
									control={control}
									render={({ field }) => (
										<FileInput type="document" accept=".pdf,.doc,.docx" value={field.value} onChange={field.onChange} />
									)}
								/>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</div>

			<Separator />
		</div>
	);
}
