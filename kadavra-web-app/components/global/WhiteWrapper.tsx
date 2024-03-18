import ProgressBar from "./ProgressBar/ProgressBar";

type WhiteWrapperProps = {
	children?: React.ReactNode;
	className?: string;
	title?: string;
	isLoading?: boolean;
} & React.ComponentProps<"section">;

const WhiteWrapper = ({
	children,
	className,
	title,
	isLoading = false,
	...rest
}: WhiteWrapperProps) => {
	return (
		<section
			className={`rounded-[5px] relative bg-white ${className}`}
			{...rest}>
			{isLoading && (
				<div className='absolute rounded-t-[5px] overflow-hidden top-0 left-0 right-0'>
					<ProgressBar value={0.7} indeterminate={true} />
				</div>
			)}
			{title && (
				<>
					<header className='px-6 rounded-[5px] py-4 lg:px-8 lg:py-6 flex items-center justify-between'>
						<h5 className='text-accent-gray'>{title}</h5>
					</header>
					<hr />
				</>
			)}
			<section className={`p-6 lg:p-8 h-full rounded-[5px]`}>
				{children}
			</section>
		</section>
	);
};

export default WhiteWrapper;
