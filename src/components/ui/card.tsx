import type { PropsWithChildren } from "hono/jsx";
import { cn } from "../../lib/utils.ts";

type Props = PropsWithChildren<{ class?: string }>;

export function Card({ class: className, children }: Props) {
	return (
		<div
			data-slot="card"
			class={cn(
				"flex flex-col gap-6 rounded-lg border bg-card py-6 text-card-foreground",
				className,
			)}
		>
			{children}
		</div>
	);
}

export function CardHeader({ class: className, children }: Props) {
	return (
		<div
			data-slot="card-header"
			class={cn(
				"grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6",
				className,
			)}
		>
			{children}
		</div>
	);
}

export function CardTitle({ class: className, children }: Props) {
	return (
		<div
			data-slot="card-title"
			class={cn(
				"font-bold text-[22px] leading-[1.27] tracking-[-0.25px]",
				className,
			)}
		>
			{children}
		</div>
	);
}

export function CardDescription({ class: className, children }: Props) {
	return (
		<div
			data-slot="card-description"
			class={cn("text-[15px] text-muted-foreground leading-[1.33]", className)}
		>
			{children}
		</div>
	);
}

export function CardContent({ class: className, children }: Props) {
	return (
		<div data-slot="card-content" class={cn("px-6", className)}>
			{children}
		</div>
	);
}
