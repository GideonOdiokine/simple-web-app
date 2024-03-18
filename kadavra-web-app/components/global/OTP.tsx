import OtpInput from "react-otp-input";

type OTPProps = {
	value?: string;
	placeholder?: string;
	label?: string;
	color?: string;
	align?: any;
	autoFocus?: boolean;
	disabled?: boolean;
	numInputs: number;
	isInputSecure?: boolean;
	onChange?: (otp: string) => void;
	errors?: string;
	required?: boolean;
};

const OTP = ({
	label,
	align,
	color,
	autoFocus,
	numInputs = 4,
	isInputSecure,
	onChange,
	value,
	errors = "",
	required = false,
}: OTPProps) => {
	return (
		<div className='OTP'>
			<div>
				{label && (
					<label style={{ textAlign: align, color: color || "" }}>
						<div className='font-semibold text-secondary mb-3'>
							<div>
								{label}
								{required && (
									<span className='text-error ml-2 font-normal'>*</span>
								)}
							</div>
						</div>
					</label>
				)}
				<OtpInput
					value={value}
					onChange={onChange}
					numInputs={numInputs}
					isInputNum={true}
					shouldAutoFocus={autoFocus || false}
					isInputSecure={isInputSecure}
					focusStyle={{ borderColor: "#0EA579" }}
				/>
			</div>
			{errors.length > 0 && (
				<div className='text-error mt-1 text-left text-sm text-accents-red'>
					{errors}
				</div>
			)}
		</div>
	);
};

export default OTP;
