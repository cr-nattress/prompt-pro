import { CollectionManager } from "@/components/settings/collection-manager";
import { requireAuth } from "@/lib/auth";
import { getCollections } from "@/lib/db/queries/collections";

export const metadata = {
	title: "Collections — Settings",
};

export default async function CollectionsPage() {
	const { workspace } = await requireAuth();
	const collections = await getCollections(workspace.id);

	return <CollectionManager collections={collections} plan={workspace.plan} />;
}
