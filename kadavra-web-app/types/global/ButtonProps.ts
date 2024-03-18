import React from "react";

export type ButtonProps = {
	type?: "button" | "submit" | "reset";
	loading?: boolean;
	disabled?: boolean;
	theme?: "primary" | "secondary" | "plain" | "outline";
	tag?: "button" | "a";
	isExternal?: boolean;
	outline?: boolean;
	icon?: string;
	href?: string;
	size?: "sm" | "md" | "lg" | "xl" | "plain";
	underline?: boolean;
	className?: string;
	children?: string;
} & Omit<React.ComponentProps<"button">, "children"> &
	Omit<React.ComponentProps<"a">, "children">;
