import { UserRound } from "lucide-react";
import { Separator } from "@/ui/separator";
import { ProfileFormData } from "./profile-edit";

function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex flex-col gap-0.5">
			<span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wide">
				{label}
			</span>
			<span className="text-[13px] font-medium text-foreground">{value}</span>
		</div>
	);
}

type ProfileSidebarProps = {
	profile: ProfileFormData;
	imgUrl?: string | null;
};

export function ProfileSidebar({ profile, imgUrl }: ProfileSidebarProps) {
	const preview = profile.image
		? URL.createObjectURL(profile.image)
		: imgUrl ?? null;

	const hasIds = profile.orcId || profile.scopusId || profile.scienceId || profile.researcherId;

	return (
		<div className="w-full lg:w-72 lg:shrink-0">
			<div className="rounded-2xl border border-border/50 bg-background overflow-hidden shadow-sm">
				{/* Avatar */}
				<div className="w-full aspect-[4/3] sm:aspect-[16/7] lg:aspect-square bg-muted flex items-center justify-center overflow-hidden relative">
					{preview ? (
						<img
							src={preview}
							alt={profile.fullName}
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="flex flex-col items-center gap-2 text-muted-foreground/40">
							<UserRound className="size-16 sm:size-20 lg:size-24" strokeWidth={1} />
						</div>
					)}
					{/* Name overlay at bottom */}
					<div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/60 to-transparent">
						<h2 className="text-white font-semibold text-[14px] leading-snug drop-shadow">
							{profile.fullName}
						</h2>
						{profile.position && (
							<p className="text-white/75 text-[12px] mt-0.5">{profile.position}</p>
						)}
					</div>
				</div>

				{/* Info */}
				<div className="px-4 py-4 flex flex-col gap-3">
					<div className="grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-3">
						{profile.department && (
							<InfoRow label="Kafedrasi" value={profile.department} />
						)}
						{profile.phone && (
							<InfoRow label="Telefon" value={profile.phone} />
						)}
						{profile.specialty && (
							<InfoRow label="Mutaxassisligi" value={profile.specialty} />
						)}
						{profile.email && (
							<InfoRow label="Email" value={profile.email} />
						)}
						{profile.age && (
							<InfoRow label="Yoshi" value={`${profile.age} yosh`} />
						)}
					</div>

					{hasIds && (
						<>
							<Separator className="opacity-50" />
							<div className="grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-3">
								{profile.orcId && (
									<InfoRow label="ORC ID" value={profile.orcId} />
								)}
								{profile.scopusId && (
									<InfoRow label="Scopus ID" value={profile.scopusId} />
								)}
								{profile.scienceId && (
									<InfoRow label="Science ID" value={profile.scienceId} />
								)}
								{profile.researcherId && (
									<InfoRow label="Researcher ID" value={profile.researcherId} />
								)}
							</div>
						</>
					)}

					{profile.bio && (
						<>
							<Separator className="opacity-50" />
							<div className="flex flex-col gap-1">
								<span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wide">
									Biografiya
								</span>
								<p className="text-[12px] leading-relaxed text-muted-foreground">
									{profile.bio}
								</p>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}