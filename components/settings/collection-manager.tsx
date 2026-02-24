"use client";

import { FolderPlus, Loader2, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
	createCollectionAction,
	deleteCollectionAction,
	updateCollectionAction,
} from "@/app/(dashboard)/settings/collections/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Collection } from "@/lib/db/schema";
import { showToast } from "@/lib/toast";
import type { WorkspacePlan } from "@/types/auth";

const COLLECTION_LIMITS: Record<string, number> = {
	free: 3,
	pro: 999,
	team: 999,
};

interface CollectionManagerProps {
	collections: Collection[];
	plan: WorkspacePlan;
}

export function CollectionManager({
	collections,
	plan,
}: CollectionManagerProps) {
	const router = useRouter();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingCollection, setEditingCollection] = useState<Collection | null>(
		null,
	);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [isPending, startTransition] = useTransition();

	const limit = COLLECTION_LIMITS[plan] ?? 3;
	const rootCollections = collections.filter((c) => !c.parentId);
	const childMap = new Map<string, Collection[]>();
	for (const c of collections) {
		if (c.parentId) {
			const existing = childMap.get(c.parentId) ?? [];
			existing.push(c);
			childMap.set(c.parentId, existing);
		}
	}

	function openCreate() {
		setEditingCollection(null);
		setName("");
		setDescription("");
		setDialogOpen(true);
	}

	function openEdit(collection: Collection) {
		setEditingCollection(collection);
		setName(collection.name);
		setDescription(collection.description ?? "");
		setDialogOpen(true);
	}

	function handleSave() {
		startTransition(async () => {
			if (editingCollection) {
				const result = await updateCollectionAction(editingCollection.id, {
					name,
					description: description || null,
				});
				if (result.success) {
					showToast("success", "Collection updated");
				} else {
					showToast("error", result.error);
				}
			} else {
				const result = await createCollectionAction({
					name,
					description: description || undefined,
				});
				if (result.success) {
					showToast("success", "Collection created");
				} else {
					showToast("error", result.error);
				}
			}
			setDialogOpen(false);
			router.refresh();
		});
	}

	function handleDelete(id: string) {
		startTransition(async () => {
			const result = await deleteCollectionAction(id);
			if (result.success) {
				showToast("success", "Collection deleted");
			} else {
				showToast("error", result.error);
			}
			router.refresh();
		});
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-semibold text-lg">Collections</h2>
					<p className="text-muted-foreground text-sm">
						Organize your prompts into folders ({collections.length}/{limit})
					</p>
				</div>
				<Button
					size="sm"
					onClick={openCreate}
					disabled={collections.length >= limit}
				>
					<FolderPlus className="mr-1.5 h-3.5 w-3.5" />
					New Collection
				</Button>
			</div>

			{rootCollections.length === 0 ? (
				<Card>
					<CardContent className="flex flex-col items-center gap-3 p-8 text-center">
						<FolderPlus className="h-8 w-8 text-muted-foreground" />
						<p className="text-muted-foreground text-sm">
							No collections yet. Create one to organize your prompts.
						</p>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-2">
					{rootCollections.map((collection) => {
						const children = childMap.get(collection.id) ?? [];
						return (
							<div key={collection.id}>
								<CollectionRow
									collection={collection}
									onEdit={openEdit}
									onDelete={handleDelete}
									isPending={isPending}
								/>
								{children.map((child) => (
									<div key={child.id} className="ml-6">
										<CollectionRow
											collection={child}
											onEdit={openEdit}
											onDelete={handleDelete}
											isPending={isPending}
										/>
									</div>
								))}
							</div>
						);
					})}
				</div>
			)}

			{plan === "free" && collections.length >= limit && (
				<p className="text-muted-foreground text-xs">
					Free plan is limited to {limit} collections. Upgrade to Pro for
					unlimited.
				</p>
			)}

			{/* Create/Edit dialog */}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>
							{editingCollection ? "Edit Collection" : "New Collection"}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor="collection-name">Name</Label>
							<Input
								id="collection-name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="e.g., Marketing Prompts"
							/>
						</div>
						<div>
							<Label htmlFor="collection-desc">Description (optional)</Label>
							<Textarea
								id="collection-desc"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="What this collection is for..."
								rows={2}
							/>
						</div>
						<Button
							className="w-full"
							onClick={handleSave}
							disabled={isPending || !name.trim()}
						>
							{isPending && (
								<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
							)}
							{editingCollection ? "Update" : "Create"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

function CollectionRow({
	collection,
	onEdit,
	onDelete,
	isPending,
}: {
	collection: Collection;
	onEdit: (c: Collection) => void;
	onDelete: (id: string) => void;
	isPending: boolean;
}) {
	return (
		<Card>
			<CardContent className="flex items-center justify-between p-3">
				<div>
					<p className="font-medium text-sm">{collection.name}</p>
					{collection.description && (
						<p className="text-muted-foreground text-xs">
							{collection.description}
						</p>
					)}
				</div>
				<div className="flex items-center gap-1">
					{collection.parentId && (
						<Badge variant="outline" className="mr-2 text-xs">
							Subfolder
						</Badge>
					)}
					<Button
						variant="ghost"
						size="sm"
						onClick={() => onEdit(collection)}
						disabled={isPending}
					>
						<Pencil className="h-3.5 w-3.5" />
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => onDelete(collection.id)}
						disabled={isPending}
					>
						<Trash2 className="h-3.5 w-3.5" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
