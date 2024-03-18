import listenForOutsideClicks from "@/helpers/listen-for-outside-clicks";
import { useEffect, useRef, useState } from "react";

type SelectInputProps = {
	label?: string;
	theme?: "primary" | "secondary" | "plain" | "outline";
	name: string;
	options: string[] | { value: string; label: string }[] | [];
	option?: string;
	all?: boolean;
	caretColor?: string;
	value?: string | any;
	position?: "top" | "bottom";
	placeholder?: string;
	onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	errors?: string[];
	icon?: boolean;
	searchable?: boolean;
	required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

const SelectInput = ({
	option,
	options,
	name,
	label,
	value,
	placeholder,
	all,
	caretColor = "#fff",
	theme = "primary",
	onChange,
	position = "bottom",
	errors = [],
	disabled = false,
	searchable = false,
	icon = false,
	required = false,
	...rest
}: SelectInputProps) => {
	const [showDropdown, setShowDropdown] = useState(false);
	const [customSelectValue, setCustomSelectValue] = useState<any>(value);
	const [searchValue, setSearchValue] = useState("");

	const menuRef = useRef(null);

	const searchRef = useRef(null);

	useEffect(() => {
		searchable && searchRef.current?.focus();
	}, []);

	useEffect(() => {
		setSearchValue("");
	}, [showDropdown]);

	const [listening, setListening] = useState(false);

	const selectTheme = (theme: string) => {
		switch (theme) {
			case "primary":
				return "bg-primary text-white border-2 border-transparent rounded-[5px]";
			case "plain":
				return ``;
			case "outline":
				return `bg-transparent text-white border-2 border-[#B8C9C9] rounded-[5px]`;
			case "secondary":
				return "bg-secondary border-2 border-transparent text-white rounded-[5px]";
			default:
				return "bg-primary text-white border-2 border-transparent rounded-[5px]";
		}
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(
		listenForOutsideClicks(listening, setListening, menuRef, setShowDropdown)
	);

	useEffect(() => {
		onChange?.(customSelectValue as any);
	}, [customSelectValue]);

	return (
		<div
			{...rest}
			className={`w-full ${
				disabled ? "pointer-events-none cursor-not-allowed" : "cursor-pointer"
			}`}>
			<label htmlFor={name}>
				<div
					className={`w-full font-bold text-left text-title mb-1 ${
						disabled
							? "pointer-events-none cursor-not-allowed"
							: "cursor-pointer"
					}`}>
					<div>
						{label}
						{required && <span className='text-error ml-2 font-normal'>*</span>}
					</div>
				</div>
			</label>
			<div
				role={"input"}
				ref={menuRef}
				className={`relative py-3 px-4 ${
					disabled ? "bg-[#F4FEFB] pointer-events-none cursor-not-allowed" : ""
				}`}
				onClick={() => setShowDropdown(!showDropdown)}>
				<select
					id={name}
					className={`appearance-none  absolute top-0 left-0 right-0 z-20 w-full py-3 px-4 border-2 border-transparent bg-transparent rounded-[5px] focus:border-primary outline-none ${
						disabled ? "cursor-not-allowed" : ""
					}`}></select>
				<div
					className={`flex absolute z-10 top-0 left-0 right-0 items-center justify-between w-full py-3 px-4 ${selectTheme(
						theme
					)} rounded-[5px]`}>
					<span
						style={{
							color: caretColor,
						}}
						className={`option ${icon ? "flex items-center gap-3" : ""}`}>
						{icon && (
							<div
								className={`currency-flag currency-flag-${customSelectValue?.value?.toLowerCase()}`}></div>
						)}
						{customSelectValue?.label || customSelectValue || placeholder}
					</span>
					{theme === "outline" ? (
						<svg
							width='20'
							className={`transition-transform ${
								showDropdown ? "rotate-180" : ""
							}`}
							height='20'
							viewBox='0 0 20 20'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								d='M15.8334 7.08331L10.0001 12.9166L4.16675 7.08331'
								stroke={caretColor}
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					) : (
						<svg
							width='24'
							className={`transition-transform ${
								showDropdown ? "rotate-180" : ""
							}`}
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								d='M6 9L12 15L18 9L6 9Z'
								fill={caretColor}
								stroke={caretColor}
								strokeWidth='1.5'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					)}
				</div>
				<div className='w-full py-3 px-4'>
					{showDropdown && (
						<>
							{searchable && (
								<input
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
									value={searchValue}
									onChange={(e) => setSearchValue(e.target.value)}
									ref={searchRef}
									placeholder='Search...'
									className='w-full absolute left-0 top-14 z-40 py-2.5 px-3 text-primary bg-white rounded border-2 border-primary outline-none'
									type='text'
								/>
							)}
							<div
								className={`absolute w-full ${searchable ? "mt-[44px]" : ""} ${
									position === "bottom" ? "top-[53px]" : "bottom-[53px]"
								} max-h-[200px] overflow-y-auto z-30 left-0 right-0 bg-secondary text-white rounded py-2 ${
									showDropdown ? "transition-all" : ""
								}`}
								style={{
									boxShadow: "0px 0px 3px rgba(255, 255, 255, 0.5)",
									backdropFilter: "blur(160px)",
								}}>
								{all && (
									<div onClick={() => setCustomSelectValue("")}>
										<button className='py-1.5 w-full text-left cursor-pointer px-3 hover:bg-[#FFFFFF1A]'>
											All
										</button>
									</div>
								)}
								{options &&
									options
										?.filter((value) =>
											JSON.stringify(value)
												.toLowerCase()
												.includes(searchValue.toLowerCase())
										)
										.map((option, i) => (
											<div onClick={() => setCustomSelectValue(option)} key={i}>
												<button className='py-1.5 w-full flex items-center text-left cursor-pointer px-3 hover:bg-[#FFFFFF1A]'>
													{icon && (
														<div
															className={`currency-flag mr-3 currency-flag-${option.value.toLowerCase()}`}></div>
													)}
													{option.label || option}
												</button>
											</div>
										))}
								{options &&
									options?.filter((value) =>
										JSON.stringify(value)
											.toLowerCase()
											.includes(searchValue.toLowerCase())
									).length === 0 && (
										<div className='py-1.5 pt-2 text-center flex justify-center space-x-2'>
											<svg
												className='mr-3'
												width='24'
												height='24'
												viewBox='0 0 79 79'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'>
												<circle cx='39.5' cy='39.5' r='39.5' fill='#F3F3F3' />
												<path
													d='M59.5467 57.3719L54.8942 54.6791C54.7489 54.5763 54.6339 54.4361 54.5614 54.2732C54.489 54.1104 54.4616 53.931 54.4823 53.7539L59.1249 56.46C59.1078 56.6359 59.1378 56.8132 59.212 56.9736C59.2861 57.1339 59.4017 57.2714 59.5467 57.3719Z'
													fill='#7A7A7A'
												/>
												<path
													d='M59.1359 56.4447L54.4933 53.7353L54.4834 50.5039L59.1293 53.21L59.1359 56.4447Z'
													fill='#7A7A7A'
												/>
												<path
													d='M61.5629 41.8721L56.917 39.166L62.1296 42.1463L66.7723 44.8524L61.5629 41.8721Z'
													fill='#4361EE'
												/>
												<path
													d='M53.2214 56.2329L48.5755 53.5268C48.4597 53.441 48.3684 53.3264 48.3106 53.1942C48.2528 53.062 48.2305 52.9169 48.246 52.7734L52.8886 55.4795C52.8734 55.6233 52.8962 55.7685 52.9546 55.9007C53.013 56.0329 53.105 56.1475 53.2214 56.2329Z'
													fill='#7A7A7A'
												/>
												<path
													d='M59.1118 47.7103L54.4659 45.001L54.4561 41.7695L59.1019 44.4756L59.1118 47.7103Z'
													fill='#7A7A7A'
												/>
												<path
													d='M60.5511 41.9679L55.9053 39.2618C56.0503 39.1575 56.2204 39.0936 56.3982 39.0767C56.5759 39.0599 56.7548 39.0907 56.9168 39.166L61.5627 41.8753C61.4011 41.7993 61.2222 41.7678 61.0444 41.784C60.8666 41.8003 60.6964 41.8637 60.5511 41.9679Z'
													fill='#7A7A7A'
												/>
												<path
													d='M59.102 44.4776L54.4561 41.7715C54.4821 41.2681 54.6272 40.7782 54.8793 40.3422C55.1313 39.9061 55.4833 39.5365 55.9059 39.2637L60.5517 41.9697C60.1289 42.2423 59.7769 42.612 59.5248 43.0481C59.2727 43.4842 59.1278 43.9742 59.102 44.4776Z'
													fill='#7A7A7A'
												/>
												<path
													d='M52.8781 55.4794L48.2355 52.7734L48.2256 49.9648L52.8715 52.6709L52.8781 55.4794Z'
													fill='#7A7A7A'
												/>
												<path
													d='M54.0342 50.6468L49.3916 47.9407L54.4658 45L59.1118 47.7094L54.0342 50.6468Z'
													fill='#7A7A7A'
												/>
												<path
													d='M52.8715 52.6729L48.2256 49.9635C48.2475 49.5581 48.3645 49.1637 48.5672 48.8123C48.7699 48.4609 49.0525 48.1625 49.392 47.9414L54.0346 50.6475C53.6953 50.8693 53.4131 51.1684 53.2109 51.5204C53.0088 51.8723 52.8925 52.2672 52.8715 52.6729Z'
													fill='#7A7A7A'
												/>
												<path
													d='M60.5529 41.9673C60.6981 41.8632 60.8684 41.7997 61.0462 41.7835C61.224 41.7672 61.4029 41.7987 61.5645 41.8748L66.7738 44.8485C67.3406 45.1789 67.3439 46.223 66.7738 47.1978L61.5974 56.1916C61.3591 56.6305 61.0118 57.0004 60.5892 57.2654C59.8478 57.6949 59.1328 57.4438 59.1295 56.4427V53.2079L54.0519 56.1486C53.3929 56.5186 52.8822 56.218 52.8789 55.4877V52.6825C52.8999 52.2769 53.0162 51.882 53.2184 51.5301C53.4205 51.1781 53.7027 50.879 54.042 50.6572L59.1196 47.7197V44.485C59.1421 43.9814 59.2838 43.4903 59.533 43.0525C59.7823 42.6147 60.1318 42.2427 60.5529 41.9673Z'
													fill='#D3D3D3'
												/>
												<path
													d='M44.1876 47.3724L39.5449 44.6663L41.5054 41.2598L46.1481 43.9658L44.1876 47.3724Z'
													fill='#4361EE'
												/>
												<path
													d='M39.877 44.9112L35.2344 42.2051L39.5442 44.6666L44.1868 47.3727L39.877 44.9112Z'
													fill='#4361EE'
												/>
												<path
													d='M35.5971 52.3487L30.9512 49.6427L35.2346 42.2051L39.8772 44.9112L35.5971 52.3487Z'
													fill='#4361EE'
												/>
												<path
													d='M41.8379 41.5049L37.1953 38.7988L41.5051 41.2604L46.1478 43.9665L41.8379 41.5049Z'
													fill='#4361EE'
												/>
												<path
													d='M41.8379 41.505L37.1953 38.7989L41.4755 31.3613L46.1214 34.0674L41.8379 41.505Z'
													fill='#4361EE'
												/>
												<path
													d='M33.6244 51.2178L28.9785 48.5117L30.9522 49.6417L35.5981 52.3478L33.6244 51.2178Z'
													fill='#4361EE'
												/>
												<path
													d='M33.6244 51.2165L28.9785 48.5104L33.2587 41.0762L37.9046 43.7822L33.6244 51.2165Z'
													fill='#4361EE'
												/>
												<path
													d='M39.8653 40.3728L35.2227 37.6667L39.5028 30.2324L44.1487 32.9385L39.8653 40.3728Z'
													fill='#4361EE'
												/>
												<path
													d='M44.1479 32.9385L39.502 30.2324L41.4756 31.3591L46.1216 34.0652L44.1479 32.9385Z'
													fill='#4361EE'
												/>
												<path
													d='M33.5948 41.3194L28.9521 38.6133L33.2587 41.0782L37.9046 43.7842L33.5948 41.3194Z'
													fill='#4361EE'
												/>
												<path
													d='M44.1476 32.9395L46.1213 34.0662L41.8378 41.5037L46.1476 43.9653L44.1871 47.3719L39.8773 44.9103L35.5971 52.3479L33.6234 51.2179L37.9036 43.7836L33.5938 41.3187L35.5543 37.9155L39.8641 40.3737L44.1476 32.9395Z'
													fill='#5B5B5B'
												/>
												<path
													d='M33.5948 41.3197L28.9521 38.6136L30.9127 35.207L35.5553 37.9164L33.5948 41.3197Z'
													fill='#4361EE'
												/>
												<path
													d='M35.5547 37.9164L30.9121 35.207L35.2219 37.6686L39.8645 40.3747L35.5547 37.9164Z'
													fill='#4361EE'
												/>
												<path
													d='M43.5187 25.654L48.1613 28.3601C46.0361 27.121 43.0936 27.2961 39.8481 29.1762L35.2021 26.4701C38.4378 24.5901 41.3802 24.4117 43.5187 25.654Z'
													fill='#7A7A7A'
												/>
												<path
													d='M31.5943 56.9261L26.9484 54.2168C24.8495 52.9943 23.5513 50.3972 23.5381 46.7032C23.5184 39.2623 28.7343 30.2057 35.1891 26.4688L39.8351 29.1748C33.3802 32.9118 28.1642 41.9717 28.184 49.4093C28.1939 53.1033 29.4954 55.7036 31.5943 56.9261Z'
													fill='#7A7A7A'
												/>
												<path
													d='M39.8347 29.1759C46.2896 25.4389 51.5384 28.4391 51.5582 35.8767C51.5779 43.3142 46.3653 52.3741 39.9105 56.1078C33.4556 59.8415 28.2034 56.8479 28.1836 49.4103C28.1639 41.9728 33.3799 32.9129 39.8347 29.1759ZM46.1478 43.9651L41.838 41.5036L46.1215 34.0693L44.1445 32.9393L39.861 40.3736L35.5512 37.9154L33.5907 41.3185L37.9005 43.7834L33.6171 51.2177L35.594 52.3477L39.8775 44.9102L44.1873 47.3717L46.1478 43.9651Z'
													fill='#F3F3F3'
												/>
												<path
													d='M23.3235 23.4543L27.9661 26.1637C27.8334 26.101 27.6862 26.0752 27.5401 26.0891C27.394 26.1031 27.2544 26.1562 27.1358 26.243L22.4932 23.537C22.6118 23.4506 22.7513 23.3975 22.8972 23.383C23.0431 23.3684 23.1902 23.3931 23.3235 23.4543Z'
													fill='#7A7A7A'
												/>
												<path
													d='M22.0609 29.1819L17.415 26.4725L22.4926 23.5352L27.1352 26.2412L22.0609 29.1819Z'
													fill='#7A7A7A'
												/>
												<path
													d='M16.9927 22.3137L21.6387 25.0197C21.4705 24.9429 21.285 24.9119 21.1011 24.9299C20.9171 24.9478 20.7411 25.0142 20.5908 25.1222L15.9482 22.416C16.0978 22.3081 16.2733 22.2417 16.4567 22.2237C16.6402 22.2057 16.8251 22.2368 16.9927 22.3137Z'
													fill='#7A7A7A'
												/>
												<path
													d='M14.4134 37.5397L9.76757 34.8336C9.20413 34.5032 9.20083 33.4591 9.76757 32.4844L14.4134 35.1905C13.8434 36.1652 13.8632 37.2324 14.4134 37.5397Z'
													fill='#7A7A7A'
												/>
												<path
													d='M14.4076 35.1901L9.76172 32.4841L14.9414 23.4902L19.584 26.1963L14.4076 35.1901Z'
													fill='#7A7A7A'
												/>
												<path
													d='M19.5831 26.196L14.9404 23.4899C15.1769 23.0495 15.5246 22.6792 15.9487 22.416L20.5913 25.1221C20.1686 25.3871 19.8214 25.757 19.5831 26.196Z'
													fill='#7A7A7A'
												/>
												<path
													d='M20.5916 25.123C21.333 24.6935 22.048 24.9446 22.0513 25.9458V29.1837L27.1255 26.2431C27.7845 25.8697 28.2953 26.1704 28.2986 26.9039V29.7091C28.2776 30.1148 28.1612 30.5097 27.9591 30.8617C27.757 31.2137 27.4748 31.5128 27.1354 31.7346L22.0579 34.6719V37.91C22.0327 38.4131 21.8878 38.9028 21.6357 39.3384C21.3835 39.7741 21.0312 40.143 20.6081 40.4145C20.4632 40.5191 20.2931 40.5832 20.1153 40.6001C19.9375 40.6169 19.7584 40.5859 19.5965 40.5103L14.3872 37.5366C13.8205 37.2062 13.8172 36.1621 14.3872 35.1874L19.5636 26.1936C19.8079 25.7534 20.1621 25.3844 20.5916 25.123Z'
													fill='#D3D3D3'
												/>
											</svg>
											No option found
										</div>
									)}
							</div>
						</>
					)}
				</div>
			</div>
			{errors.length > 0 && (
				<span className='text-error text-sm text-accents-red'>
					{errors.map((error) => error)}
				</span>
			)}
		</div>
	);
};

export default SelectInput;
