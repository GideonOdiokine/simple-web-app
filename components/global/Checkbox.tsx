import React from "react";

type CheckboxProps = {
	label?: string;
	value?: boolean;
	onChange?: (value: boolean) => void;
	size?: "sm" | "md" | "lg";
	id?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Checkbox = ({
	label,
	size = "md",
	value,
	onChange,
	id,
	...rest
}: CheckboxProps) => {
	const checkboxSize = (size: string) => {
		switch (size) {
			case "sm":
				return "h-4 w-4";
			case "md":
				return "h-6 w-6";
			case "lg":
				return "h-8 w-8";
			default:
				return "h-6 w-6";
		}
	};

	return (
		<div className='flex justify-center '>
			<div className='flex items-center'>
				<input
					className={`${checkboxSize(
						size
					)} form-check-input appearance-none border-2 border-[#D4EBEB] rounded-sm bg-white checked:bg-primary checked:border-primary focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left mr-4 cursor-pointer`}
					type='checkbox'
					value=''
					id={id}
					{...rest}
				/>
				<label className='text-dark-100 font-epilogue' htmlFor={id}>
					{label}
				</label>
			</div>
		</div>
	);
};

export default Checkbox;
