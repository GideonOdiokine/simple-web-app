type SwitchProps = {
	label: string;
};

const Switch = ({ label }: SwitchProps) => {
	return (
		<div className='flex'>
			<div className='form-check form-switch space-x-[10px]'>
				<input
					className='form-check-input appearance-none w-[42px] -ml-10 rounded-full float-left h-6 align-top  bg-no-repeat bg-contain bg-[#E0E0E0] checked:bg-primary focus:outline-none cursor-pointer shadow-sm'
					type='checkbox'
					role='switch'
					id='flexSwitchCheckDefault'
				/>
				<label
					className='form-check-label block font-bold mt-[2px] text-left'
					htmlFor='flexSwitchCheckDefault'>
					{label}
				</label>
			</div>
		</div>
	);
};

export default Switch;
