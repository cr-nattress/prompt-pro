import { type ExternalToast, toast } from "sonner";

type ToastType = "success" | "info" | "warning" | "error";

const DURATION_MAP: Record<ToastType, number> = {
	success: 3000,
	info: 3000,
	warning: 5000,
	error: Infinity, // persistent — user must dismiss
};

export function showToast(
	type: ToastType,
	message: string,
	options?: ExternalToast,
) {
	const duration = DURATION_MAP[type];
	toast[type](message, { duration, ...options });
}
