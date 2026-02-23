"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ParameterFormProps {
	parameters: string[];
	values: Record<string, string>;
	onValueChange: (key: string, value: string) => void;
}

export function ParameterForm({
	parameters,
	values,
	onValueChange,
}: ParameterFormProps) {
	if (parameters.length === 0) return null;

	return (
		<div className="flex flex-col gap-3">
			<Label className="font-medium text-xs text-muted-foreground uppercase tracking-wider">
				Parameters
			</Label>
			{parameters.map((param) => (
				<div key={param} className="flex flex-col gap-1.5">
					<Label htmlFor={`param-${param}`} className="text-sm">
						{`{{${param}}}`}
					</Label>
					<Input
						id={`param-${param}`}
						placeholder={`Value for ${param}`}
						value={values[param] ?? ""}
						onChange={(e) => onValueChange(param, e.target.value)}
					/>
				</div>
			))}
		</div>
	);
}
