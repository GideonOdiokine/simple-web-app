type Props = {
	children: React.ReactNode;
	step?: any;
	show?: boolean;
	steps: {
		name: string;
		step: number;
	}[];
};

const ConvertCurrencyFlowWrapper = ({
	children,
	step,
	show = true,
	steps,
}: Props) => {
	return (
		<section>
			{show && (
				<header className='flex space-x-6 lg:space-x-20 items-center w-full mb-7 overflow-auto scrollbar-hide'>
					{steps.map(({ step: _step, name }, index) => (
						<div key={_step + index} className='flex items-center gap-4'>
							<div
								className={`w-[30px] h-[30px] lg:w-[47px] lg:h-[47px] border border-1 ${
									_step <= step
										? "bg-primary border-transparent text-white"
										: "border-accent-gray text-accent-gray"
								} rounded-full p-3 flex justify-center items-center font-semibold`}>
								{_step}
							</div>
							<div className='text-sm lg:text-lg whitespace-nowrap w-[calc(100%-67px)] text-accent-gray'>
								{name}
							</div>
						</div>
					))}
				</header>
			)}
			{children}
		</section>
	);
};

export default ConvertCurrencyFlowWrapper;

ConvertCurrencyFlowWrapper.defaultProps = {
	steps: [
		{
			name: "Enter Amount",
			step: 1,
		},
		{
			name: "Bank Details",
			step: 2,
		},
		{
			name: "Payment",
			step: 3,
		},
		// {
		// 	name: "Confirmation",
		// 	step: 4,
		// },
	],
};
