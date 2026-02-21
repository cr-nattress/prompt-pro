"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useQueryState } from "nuqs";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { blueprintSearchParams } from "@/lib/search-params/blueprints";

const SORT_OPTIONS = [
	{ value: "updatedAt", label: "Last updated" },
	{ value: "createdAt", label: "Date created" },
	{ value: "name", label: "Name" },
];

const ORDER_OPTIONS = [
	{ value: "desc", label: "Descending" },
	{ value: "asc", label: "Ascending" },
];

export function BlueprintListToolbar() {
	const [search, setSearch] = useQueryState(
		"search",
		blueprintSearchParams.search,
	);
	const [sort, setSort] = useQueryState("sort", blueprintSearchParams.sort);
	const [order, setOrder] = useQueryState("order", blueprintSearchParams.order);
	const [, setPage] = useQueryState("page", blueprintSearchParams.page);

	const [localSearch, setLocalSearch] = useState(search);
	const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

	useEffect(() => {
		setLocalSearch(search);
	}, [search]);

	const handleSearchChange = useCallback(
		(value: string) => {
			setLocalSearch(value);
			if (debounceRef.current) clearTimeout(debounceRef.current);
			debounceRef.current = setTimeout(() => {
				setSearch(value || null);
				setPage(1);
			}, 200);
		},
		[setSearch, setPage],
	);

	const hasFilters = sort !== "updatedAt" || order !== "desc";

	const clearFilters = useCallback(() => {
		setSort(null);
		setOrder(null);
		setPage(1);
	}, [setSort, setOrder, setPage]);

	const filterControls = (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-1.5">
				<label className="font-medium text-sm" htmlFor="sort-filter">
					Sort by
				</label>
				<Select
					value={sort}
					onValueChange={(v) => {
						setSort(v as typeof sort);
						setPage(1);
					}}
				>
					<SelectTrigger id="sort-filter">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{SORT_OPTIONS.map((opt) => (
							<SelectItem key={opt.value} value={opt.value}>
								{opt.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex flex-col gap-1.5">
				<label className="font-medium text-sm" htmlFor="order-filter">
					Order
				</label>
				<Select
					value={order}
					onValueChange={(v) => {
						setOrder(v as typeof order);
						setPage(1);
					}}
				>
					<SelectTrigger id="order-filter">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{ORDER_OPTIONS.map((opt) => (
							<SelectItem key={opt.value} value={opt.value}>
								{opt.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{hasFilters && (
				<Button variant="ghost" size="sm" onClick={clearFilters}>
					<X className="mr-1.5 h-3.5 w-3.5" />
					Clear filters
				</Button>
			)}
		</div>
	);

	return (
		<div className="flex items-center gap-2">
			<div className="relative flex-1">
				<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					placeholder="Search blueprints..."
					value={localSearch}
					onChange={(e) => handleSearchChange(e.target.value)}
					className="pl-9"
				/>
			</div>

			{/* Desktop filters */}
			<div className="hidden items-center gap-2 md:flex">
				<Select
					value={sort}
					onValueChange={(v) => {
						setSort(v as typeof sort);
						setPage(1);
					}}
				>
					<SelectTrigger className="w-[150px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{SORT_OPTIONS.map((opt) => (
							<SelectItem key={opt.value} value={opt.value}>
								{opt.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{hasFilters && (
					<Button variant="ghost" size="sm" onClick={clearFilters}>
						<X className="mr-1 h-3.5 w-3.5" />
						Clear
					</Button>
				)}
			</div>

			{/* Mobile filters */}
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="outline" size="icon" className="md:hidden">
						<SlidersHorizontal className="h-4 w-4" />
						<span className="sr-only">Filters</span>
					</Button>
				</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Filters</SheetTitle>
					</SheetHeader>
					<div className="mt-4">{filterControls}</div>
				</SheetContent>
			</Sheet>
		</div>
	);
}
