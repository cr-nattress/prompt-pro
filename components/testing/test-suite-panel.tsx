"use client";

import {
	AlertCircle,
	CheckCircle,
	Loader2,
	Pencil,
	Play,
	Plus,
	Trash2,
	XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
	createTestCaseAction,
	deleteTestCaseAction,
	getTestSuiteAction,
	runTestSuiteAction,
	updateTestCaseAction,
} from "@/app/(dashboard)/prompts/test-actions";
import { ModelSelector } from "@/components/playground/model-selector";
import { TestCaseForm } from "@/components/testing/test-case-form";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_MODEL_ID } from "@/lib/ai/models";
import type { TestCase } from "@/lib/db/schema/test-suites";
import type { TestAssertion, TestCaseResult } from "@/lib/testing/assertions";

interface TestSuitePanelProps {
	promptTemplateId: string;
	promptVersionId: string;
	detectedParams: string[];
}

export function TestSuitePanel({
	promptTemplateId,
	promptVersionId,
	detectedParams,
}: TestSuitePanelProps) {
	const [cases, setCases] = useState<TestCase[]>([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editingCase, setEditingCase] = useState<TestCase | null>(null);
	const [saving, setSaving] = useState(false);
	const [modelId, setModelId] = useState(DEFAULT_MODEL_ID);
	const [running, setRunning] = useState(false);
	const [results, setResults] = useState<TestCaseResult[] | null>(null);

	const loadCases = useCallback(async () => {
		const result = await getTestSuiteAction(promptTemplateId);
		if (result.success) {
			setCases(result.data.cases);
		}
		setLoading(false);
	}, [promptTemplateId]);

	useEffect(() => {
		loadCases();
	}, [loadCases]);

	async function handleCreate(data: {
		name: string;
		description: string;
		parameters: Record<string, string>;
		assertions: TestAssertion[];
	}) {
		setSaving(true);
		const result = await createTestCaseAction(promptTemplateId, data);
		setSaving(false);
		if (result.success) {
			setShowForm(false);
			loadCases();
		}
	}

	async function handleUpdate(data: {
		name: string;
		description: string;
		parameters: Record<string, string>;
		assertions: TestAssertion[];
	}) {
		if (!editingCase) return;
		setSaving(true);
		await updateTestCaseAction(editingCase.id, data);
		setSaving(false);
		setEditingCase(null);
		loadCases();
	}

	async function handleDelete(id: string) {
		await deleteTestCaseAction(id);
		loadCases();
	}

	async function handleRunTests() {
		setRunning(true);
		setResults(null);
		const result = await runTestSuiteAction(
			promptTemplateId,
			promptVersionId,
			modelId,
		);
		setRunning(false);
		if (result.success) {
			setResults(result.data.results);
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center py-8">
				<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h3 className="font-semibold text-sm">Test Cases</h3>
				<Button
					size="sm"
					variant="outline"
					onClick={() => {
						setShowForm(true);
						setEditingCase(null);
					}}
				>
					<Plus className="mr-1.5 h-3.5 w-3.5" />
					Add Test
				</Button>
			</div>

			{showForm && !editingCase && (
				<TestCaseForm
					detectedParams={detectedParams}
					onSave={handleCreate}
					onCancel={() => setShowForm(false)}
					saving={saving}
				/>
			)}

			{cases.length === 0 && !showForm && (
				<p className="py-4 text-center text-muted-foreground text-sm">
					No test cases yet. Add one to start testing your prompt.
				</p>
			)}

			{cases.map((tc) => {
				if (editingCase?.id === tc.id) {
					return (
						<TestCaseForm
							key={tc.id}
							initialName={tc.name}
							initialDescription={tc.description ?? ""}
							initialParameters={
								(tc.parameters as Record<string, string>) ?? {}
							}
							initialAssertions={(tc.assertions as TestAssertion[]) ?? []}
							detectedParams={detectedParams}
							onSave={handleUpdate}
							onCancel={() => setEditingCase(null)}
							saving={saving}
						/>
					);
				}

				const caseResult = results?.find((r) => r.testCaseId === tc.id);

				return (
					<Card key={tc.id} className="py-3">
						<CardHeader className="py-0">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									{caseResult ? (
										caseResult.passed ? (
											<CheckCircle className="h-4 w-4 text-green-500" />
										) : (
											<XCircle className="h-4 w-4 text-destructive" />
										)
									) : null}
									<CardTitle className="text-sm">{tc.name}</CardTitle>
									<Badge variant="outline" className="text-xs">
										{(tc.assertions as TestAssertion[])?.length ?? 0} assertions
									</Badge>
								</div>
								<div className="flex items-center gap-1">
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => setEditingCase(tc)}
									>
										<Pencil className="h-3 w-3" />
									</Button>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button variant="ghost" size="icon-sm">
												<Trash2 className="h-3 w-3" />
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>Delete test case?</AlertDialogTitle>
												<AlertDialogDescription>
													This will permanently delete &quot;{tc.name}&quot;.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction onClick={() => handleDelete(tc.id)}>
													Delete
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</div>
						</CardHeader>
						{caseResult && (
							<CardContent className="pt-2">
								<div className="rounded-md bg-muted/50 p-3">
									<p className="mb-1 font-medium text-xs">Response:</p>
									<pre className="line-clamp-4 whitespace-pre-wrap text-xs">
										{caseResult.responseText || "(empty)"}
									</pre>
									{caseResult.assertionResults.map((ar, i) => (
										<div
											key={`ar-${tc.id}-${i}`}
											className="mt-1 flex items-center gap-1.5 text-xs"
										>
											{ar.passed ? (
												<CheckCircle className="h-3 w-3 text-green-500" />
											) : (
												<AlertCircle className="h-3 w-3 text-destructive" />
											)}
											<span>{ar.message}</span>
										</div>
									))}
								</div>
							</CardContent>
						)}
					</Card>
				);
			})}

			{cases.length > 0 && (
				<>
					<div className="flex items-center gap-2">
						<div className="w-48">
							<ModelSelector value={modelId} onChange={setModelId} />
						</div>
						<Button
							onClick={handleRunTests}
							disabled={running || cases.length === 0}
						>
							{running ? (
								<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
							) : (
								<Play className="mr-1.5 h-3.5 w-3.5" />
							)}
							Run Tests
						</Button>
					</div>
					{results && (
						<div className="flex items-center gap-3 rounded-md border p-3">
							<Badge
								variant={
									results.every((r) => r.passed) ? "default" : "destructive"
								}
							>
								{results.filter((r) => r.passed).length}/{results.length} passed
							</Badge>
							<span className="text-muted-foreground text-xs">
								Total latency:{" "}
								{(
									results.reduce((sum, r) => sum + r.latencyMs, 0) / 1000
								).toFixed(1)}
								s
							</span>
						</div>
					)}
				</>
			)}
		</div>
	);
}
