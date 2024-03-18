import { ButtonProps } from "@/types/global/ButtonProps";
import Image from "next/image";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/router";

const Button: React.FC<ButtonProps> = ({
	loading = false,
	disabled,
	theme = "primary",
	icon = null,
	href,
	size = "md",
	underline = true,
	outline = false,
	isExternal = false,
	children,
	tag,
	className,
	type = "button",
	...rest
}) => {
	const router = useRouter();

	const buttonTheme = (theme: string) => {
		switch (theme) {
			case "primary":
				return "bg-primary text-white border-2 border-transparent rounded-[5px]";
			case "plain":
				return ``;
			case "outline":
				return `bg-transparent text-primary border-2 border-[#DDE4F6] rounded-[5px]`;
			case "secondary":
				return "bg-secondary text-white rounded-[5px]";
			default:
				return "bg-primary text-white border-2 border-transparent rounded-[5px]";
		}
	};

	const LinkTheme = (theme: string) => {
		switch (theme) {
			case "primary":
				return "text-primary";
			case "secondary":
				return "text-secondary";
			default:
				return "text-primary";
		}
	};

	const buttonSize = (size: string) => {
		switch (size) {
			case "sm":
				return "px-4 py-2";
			case "md":
				return "px-6 py-3";
			case "lg":
				return "px-8 py-4";
			case "xl":
				return "px-10 py-5";
			default:
				return "px-6 py-3";
		}
	};

	const iconSize = (icon: string) => {
		switch (icon) {
			case "sm":
				return 20;
			case "md":
				return 24;
			case "lg":
				return 32;
			case "xl":
				return 36;
			default:
				return 24;
		}
	};

	const iconColor = (theme: string) => {
		switch (theme) {
			case "primary":
				return "#fff";
			case "outline":
				return "#7F4433";
			default:
				return "#fff";
		}
	};

	if (tag === "a") {
		return (
			<Link
				href={
					isExternal
						? !href?.includes("https" || "http")
							? `https://${href}`
							: href
						: href || router.pathname
				}>
				<a
					className={`${LinkTheme(theme)} ${
						underline ? "underline" : null
					} ${className}`}
					{...rest}>
					{children}
				</a>
			</Link>
		);
	}

	return (
		<button
			type={type}
			disabled={disabled || loading}
			className={`flex items-center font-epilogue justify-center transition-all hover:brightness-90 disabled:brightness-[60%] ease-in text-center gap-4 font-bold disabled:cursor-not-allowed ${buttonTheme(
				theme
			)} ${buttonSize(size)} ${className}`}
			{...rest}>
			<ClipLoader color={iconColor(theme)} loading={loading} size={20} />
			{icon && (
				<Image
					src={`/assets/icons/${icon}.svg`}
					width={iconSize(size)}
					height={iconSize(size)}
				/>
			)}
			{children}
		</button>
	);
};

export default Button;
