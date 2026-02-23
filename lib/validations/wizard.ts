import { z } from "zod";

export const wizardStepDataSchema = z.object({
	role: z.string().min(1).max(500),
	task: z.string().min(1).max(2000),
	inputType: z.string().max(1000),
	outputFormat: z.string().max(1000),
	constraints: z.array(z.string().max(200)).max(10),
	tone: z.string().max(100),
	customConstraints: z.string().max(1000),
});

export type WizardStepDataValues = z.infer<typeof wizardStepDataSchema>;
