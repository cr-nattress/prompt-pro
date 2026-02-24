import { notFound } from "next/navigation";
import { GalleryDetail } from "@/components/gallery/gallery-detail";
import { getGalleryDetailAction } from "../actions";

interface Props {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
	const { id } = await params;
	const detail = await getGalleryDetailAction(id);
	return {
		title: detail ? `${detail.promptName} — Gallery` : "Gallery",
	};
}

export default async function GalleryDetailPage({ params }: Props) {
	const { id } = await params;
	const detail = await getGalleryDetailAction(id);

	if (!detail) notFound();

	return (
		<div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
			<GalleryDetail
				listing={detail.listing}
				promptName={detail.promptName}
				promptPurpose={detail.promptPurpose}
				promptDescription={detail.promptDescription}
				promptTags={detail.promptTags}
				versionText={detail.version?.templateText ?? null}
				analysisResult={detail.version?.analysisResult}
				userRating={detail.userRating}
			/>
		</div>
	);
}
