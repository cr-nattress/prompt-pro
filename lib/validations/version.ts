import { z } from "zod";

export const promoteVersionSchema = z.object({
	versionId: z.string().uuid("Invalid version ID"),
	parentId: z.string().uuid("Invalid parent ID"),
	newStatus: z.enum(["active", "stable", "deprecated"]),
});

export type PromoteVersionValues = z.infer<typeof promoteVersionSchema>;

export const changeNoteSchema = z.object({
	changeNote: z.string().max(500).optional(),
});

export type ChangeNoteValues = z.infer<typeof changeNoteSchema>;
