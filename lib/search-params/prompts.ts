import {
	createSearchParamsCache,
	parseAsInteger,
	parseAsString,
	parseAsStringLiteral,
} from "nuqs/server";

const sortOptions = ["updatedAt", "createdAt", "name"] as const;
const orderOptions = ["asc", "desc"] as const;

export const promptSearchParams = {
	search: parseAsString.withDefault(""),
	purpose: parseAsString,
	tag: parseAsString,
	sort: parseAsStringLiteral(sortOptions).withDefault("updatedAt"),
	order: parseAsStringLiteral(orderOptions).withDefault("desc"),
	page: parseAsInteger.withDefault(1),
};

export const promptSearchParamsCache =
	createSearchParamsCache(promptSearchParams);
