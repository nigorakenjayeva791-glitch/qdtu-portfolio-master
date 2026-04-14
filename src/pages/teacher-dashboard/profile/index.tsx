import type { ProfileFormData } from "@/pages/teachers/detail/detail-profile/profile-edit";
import { ProfileForm } from "@/pages/teachers/detail/detail-profile/profile-form";
import { ProfileSidebar } from "@/pages/teachers/detail/detail-profile/profile-sidebar";

const profile: ProfileFormData = {
	fullName: "Karimov Bobur Aliyevich",
	email: "bobur.karimov@qdtu.uz",
	age: "42",
	phone: "+998900000000",
	department: "Farmatsiya va kimyo kafedrasi",
	position: "Dotsent",
	bio: "Farmatsiya va kimyo sohasida 15 yildan ortiq tajribaga ega mutaxassis.",
	additionalInfo: "",
	specialty: "Farmatsiya",
	orcId: "0000-0002-1234-5678",
	scopusId: "57210000000",
	scienceId: "",
	researcherId: "",
	image: null,
	resume: null,
};

export default function TeacherProfile() {
	return (
		<div className="flex flex-col lg:flex-row gap-4 sm:gap-5 items-start">
			<ProfileSidebar profile={profile} />
			<div className="w-full lg:flex-1 min-w-0">
				<ProfileForm defaultValues={profile} />
			</div>
		</div>
	);
}
