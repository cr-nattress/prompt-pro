"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface RunSettingsProps {
	temperature: number;
	maxTokens: number;
	onTemperatureChange: (value: number) => void;
	onMaxTokensChange: (value: number) => void;
}

export function RunSettings({
	temperature,
	maxTokens,
	onTemperatureChange,
	onMaxTokensChange,
}: RunSettingsProps) {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<Label htmlFor="temperature" className="text-sm">
						Temperature
					</Label>
					<span className="font-mono text-muted-foreground text-xs">
						{temperature.toFixed(1)}
					</span>
				</div>
				<Slider
					id="temperature"
					min={0}
					max={2}
					step={0.1}
					value={[temperature]}
					onValueChange={([val]) => {
						if (val !== undefined) onTemperatureChange(val);
					}}
				/>
			</div>
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="max-tokens" className="text-sm">
					Max tokens
				</Label>
				<Input
					id="max-tokens"
					type="number"
					min={1}
					max={32000}
					value={maxTokens}
					onChange={(e) => {
						const val = Number.parseInt(e.target.value, 10);
						if (!Number.isNaN(val)) onMaxTokensChange(val);
					}}
				/>
			</div>
		</div>
	);
}
