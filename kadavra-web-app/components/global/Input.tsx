import { InputProps } from "@/types/global/InputProps";
import { useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import { Calendar } from "react-date-range";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import listenForOutsideClicks from "@/helpers/listen-for-outside-clicks";

const Input = ({
	label,
	placeholder,
	type = "text",
	id,
	onChange,
	value,
	max,
	autoComplete = "off",
	disabled = false,
	theme = "outline",
	focused = false,
	optional = false,
	errors = [],
	error = "",
	loading = false,
	required = false,
	...rest
}: InputProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [showCalendar, setShowCalendar] = useState(false);

	useEffect(() => {
		if (focused) {
			inputRef.current?.focus();
		}
	}, [focused]);

	const inputTheme = (theme: "outline" | "plain") => {
		switch (theme) {
			case "outline":
				return `py-3 px-4 bg-transparent border-2 border-[#B8C9C9] rounded-[5px] focus:border-primary ${
					errors.length > 0 && errors[0] !== undefined
						? "border-error focus:border-error"
						: ""
				} ${disabled ? "bg-[#F4FEFB]" : ""}`;
			case "plain":
				return "py-3 px-4 bg-transparent border-2 border-transparent rounded-[5px]";
			default:
				return "bg-white border-2 border-gray-300";
		}
	};

	const menuRef = useRef(null);
	const [listening, setListening] = useState(false);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(
		listenForOutsideClicks(listening, setListening, menuRef, setShowCalendar)
	);

	const [state, setState] = useState([
		{
			startDate: new Date(),
			endDate: new Date(),
			key: "selection",
		},
	]);

	useEffect(() => {
		type === "date" && setShowCalendar(false);

		if (type === "date-range") {
			value[0]?.startDate !== value[0]?.endDate && setShowCalendar(false);
		}
	}, [value]);

	useEffect(() => {
		type === "date-range" &&
			onChange?.(
				`${formatter.format(new Date(state[0].startDate))} - ${formatter.format(
					new Date(state[0].endDate)
				)}` as any
			);
	}, [state]);

	const formatter = new Intl.DateTimeFormat("en", {
		year: "numeric",
		month: "short",
		day: "2-digit",
	});

	return (
		<label
			onClick={(e) => {
				e.stopPropagation();
				setTimeout(() => {
					(type === "date" || type === "date-range") &&
						setShowCalendar(!showCalendar);
				}, 0);
			}}
			htmlFor={id}
			className='flex w-full flex-col relative'>
			<span className='w-full font-bold text-left text-title mb-1 flex items-center justify-between'>
				<div>
					{label}
					{required && <span className='text-error ml-2 font-normal'>*</span>}
				</div>
				{optional && (
					<span className='text-sm font-normal text-primary'>Optional</span>
				)}
			</span>
			{type === "date" && (
				<div
					className={`flex h-[52px] items-center relative w-full gap-4 ${inputTheme(
						theme
					)}`}>
					<svg
						width='25'
						height='24'
						viewBox='0 0 25 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<path
							d='M19.5 4H5.5C4.39543 4 3.5 4.89543 3.5 6V20C3.5 21.1046 4.39543 22 5.5 22H19.5C20.6046 22 21.5 21.1046 21.5 20V6C21.5 4.89543 20.6046 4 19.5 4Z'
							stroke='#B8C9C9'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
						<path
							d='M16.5 2V6'
							stroke='#B8C9C9'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
						<path
							d='M8.5 2V6'
							stroke='#B8C9C9'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
						<path
							d='M3.5 10H21.5'
							stroke='#B8C9C9'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
					{value ? formatter.format(new Date(value)) : placeholder}
					{showCalendar && (
						<div
							ref={menuRef}
							onClick={(e) => e.stopPropagation()}
							className='absolute shadow-lg left-1/2 -translate-x-1/2 top-[50px] z-50'>
							<Calendar
								editableDateInputs={true}
								date={value || new Date()}
								onChange={onChange}
							/>
						</div>
					)}
				</div>
			)}
			{type === "date-range" && (
				<div
					className={`flex h-[52px] items-center relative w-full gap-4 ${inputTheme(
						theme
					)}`}>
					<svg
						width='25'
						height='24'
						viewBox='0 0 25 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<path
							d='M19.5 4H5.5C4.39543 4 3.5 4.89543 3.5 6V20C3.5 21.1046 4.39543 22 5.5 22H19.5C20.6046 22 21.5 21.1046 21.5 20V6C21.5 4.89543 20.6046 4 19.5 4Z'
							stroke='#B8C9C9'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
						<path
							d='M16.5 2V6'
							stroke='#B8C9C9'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
						<path
							d='M8.5 2V6'
							stroke='#B8C9C9'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
						<path
							d='M3.5 10H21.5'
							stroke='#B8C9C9'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
					{value ? value : placeholder}
					{showCalendar && (
						<div
							ref={menuRef}
							onClick={(e) => e.stopPropagation()}
							className='absolute shadow-lg left-1/2 -translate-x-1/2 z-50 top-[60px]'>
							<DateRange
								editableDateInputs={true}
								onChange={(item) => setState([item.selection])}
								moveRangeOnFirstSelection={false}
								ranges={state}
							/>
						</div>
					)}
				</div>
			)}
			{type === "search" && (
				<div className={`flex items-center w-full gap-4 ${inputTheme(theme)}`}>
					<div>
						<img src='/assets/icons/search.svg' alt='search' title='search' />
					</div>
					<input
						ref={inputRef}
						className=' focus:border-primary bg-transparent outline-none w-full'
						type={type}
						placeholder={placeholder}
						id={id}
						value={value}
						onChange={onChange}
						disabled={disabled}
						{...rest}
					/>
				</div>
			)}
			{type !== "file" &&
				type !== "search" &&
				type !== "date" &&
				type !== "date-range" && (
					<input
						ref={inputRef}
						className={`w-full ${inputTheme(theme)} rounded-[5px] outline-none`}
						type={type}
						placeholder={placeholder}
						id={id}
						value={value}
						onChange={onChange}
						disabled={disabled}
						{...rest}
					/>
				)}
			{type === "file" && (
				<>
					<input
						className='appearance-none hidden'
						type='file'
						placeholder={placeholder}
						id={id}
						value={value}
						onChange={onChange}
						disabled={disabled}
						{...rest}
					/>
					<div className='w-full dashed-file text-center flex-col flex justify-center items-center cursor-pointer gap-2 md:gap-4 py-6 px-10 bg-[#F8F8FD] rounded-[8px] outline-none'>
						<svg
							width='32'
							height='32'
							viewBox='0 0 32 32'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								d='M20 10.668H20.0133'
								stroke='#0EA579'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
							<path
								d='M22.6668 5.33203H9.3335C7.12436 5.33203 5.3335 7.12289 5.3335 9.33203V22.6654C5.3335 24.8745 7.12436 26.6654 9.3335 26.6654H22.6668C24.876 26.6654 26.6668 24.8745 26.6668 22.6654V9.33203C26.6668 7.12289 24.876 5.33203 22.6668 5.33203Z'
								stroke='#0EA579'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
							<path
								d='M5.3335 19.9999L10.6668 14.6666C11.2749 14.0815 11.9647 13.7734 12.6668 13.7734C13.369 13.7734 14.0588 14.0815 14.6668 14.6666L21.3335 21.3333'
								stroke='#0EA579'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
							<path
								d='M18.6665 18.6679L19.9998 17.3346C20.6079 16.7494 21.2977 16.4414 21.9998 16.4414C22.702 16.4414 23.3918 16.7494 23.9998 17.3346L26.6665 20.0012'
								stroke='#0EA579'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>

						<span className='text-[#515B6F]'>
							<span className='text-primary'>Click to replace</span> or drag and
							drop
						</span>

						<span className='text-[#C1C5D0] text-sm sm:text-base'>
							SVG, PNG, JPG or GIF (max. 400 x 400px)
						</span>
					</div>
				</>
			)}
			{errors.length > 0 && (
				<span className='text-error text-sm text-accents-red'>
					{errors.map((error) => error)}
				</span>
			)}
			{error && (
				<span className='text-error text-sm text-accents-red'>{error}</span>
			)}
			{loading && (
				<span className='absolute right-4 top-[43px]'>
					<ClipLoader color={"#061A14"} loading={loading} size={20} />
				</span>
			)}
		</label>
	);
};

export default Input;
