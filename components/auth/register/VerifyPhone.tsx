import Button from "@/components/global/Button";
import Input from "@/components/global/Input";
import Modal from "@/components/global/Modal";
import OTP from "@/components/global/OTP";
import { VerifyPhoneOTPRequest } from "@/types/auth/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
	useGeneratePhoneOTPMutation,
	useVerifyPhoneOTPMutation,
} from "src/services/auth";

type VerifyPhoneProps = {
	getLoading?: (val: boolean) => void;
};

const VerifyPhone = ({ getLoading }: VerifyPhoneProps) => {
	const [showModal, setShowModal] = useState(false);

	const router = useRouter();

	const { phone, id, bvn } = router.query;

	const {
		formState: { errors, isValid },
		handleSubmit,
		control,
		setValue,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			otp: "",
		},
	});

	const {
		formState: { errors: errorsPhone, isValid: isValidPhone },
		handleSubmit: handleSubmitPhone,
		control: controlPhone,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			phone: phone.toString(),
		},
	});

	const [generateOTP, { isLoading }] = useGeneratePhoneOTPMutation();

	useEffect(() => {
		getLoading(isLoading);
	}, [isLoading]);

	const handleGenerateOTP = async (newPhone?: string) => {
		try {
			const response = await generateOTP({
				registrationId: id.toString(),
				bvn: bvn.toString(),
				phoneNumber: newPhone || phone.toString().replace(/[+]/g, ""),
			}).unwrap();
			// setValue("otp", response.otp, { shouldValidate: true });
			setShowModal(false);
			toast.success("OTP sent successfully");
		} catch (err) {
			toast.error(err?.data?.responseDescription);
		}
	};

	useEffect(() => {
		handleGenerateOTP();
	}, []);

	const [verifyOTP, { isLoading: isLoadingVerifyOTP }] =
		useVerifyPhoneOTPMutation();

	const onSubmit: SubmitHandler<VerifyPhoneOTPRequest> = async (data) => {
		try {
			await verifyOTP({
				registrationId: id.toString(),
				bvn: bvn.toString(),
				phoneNumber: phone.toString().replace(/[+]/g, ""),
				otp: data.otp,
			}).unwrap();
			toast.success("OTP verified successfully");
			router.push({
				pathname: router.pathname,
				query: {
					...router.query,
					step: "verify-email",
				},
			});
		} catch (err) {
			toast.error(err?.data?.responseDescription);
		}
	};

	const editPhone = async (data: any) => {
		await router.replace({
			pathname: router.pathname,
			query: {
				...router.query,
				phone: data.phone.startsWith("0")
					? `234${data.phone.slice(1)}`
					: data.phone.replace(/[+]/g, ""),
			},
		});
		handleGenerateOTP(
			data.phone.startsWith("0")
				? `234${data.phone.slice(1)}`
				: data.phone.replace(/[+]/g, "")
		);
	};

	const showResendOtpModal = (e: any) => {
		e.preventDefault();
		setShowModal(true);
	};

	return (
		<section>
			<div className='text-center space-y-[7px] mb-10'>
				<h1 className='text-center text-2xl lg:text-[32px] font-bold text-secondary'>
					Verify your Phone Number
				</h1>
				<p className='text-accent-gray lg:text-lg leading-[29px]'>
					We sent an OTP to {phone} by SMS and WhatsApp.
				</p>
			</div>
			<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
				<Controller
					name='otp'
					control={control}
					rules={{
						required: "OTP is required",
						maxLength: {
							value: 6,
							message: "OTP must be 6 digits",
						},
						minLength: {
							value: 6,
							message: "OTP must be 6 digits",
						},
					}}
					render={({ field: { onChange, value } }) => (
						<OTP
							value={value}
							numInputs={6}
							label='Enter OTP Code'
							align='left'
							isInputSecure={false}
							autoFocus={true}
							onChange={onChange}
							errors={errors?.otp?.message}
							required
						/>
					)}
				/>
				<br />
				<Button
					disabled={!isValid}
					type='submit'
					className='w-full'
					loading={isLoadingVerifyOTP}>
					Verify
				</Button>
				<div className='text-center md:text-left'>
					Didn’t get the code?{" "}
					<Button
						tag='a'
						onClick={(e: any) => {
							e.preventDefault();
							handleGenerateOTP();
						}}
						className='text-primary font-bold'>
						Resend
					</Button>
				</div>
			</form>
			<div className='p-4 bg-[#0EA5791A] rounded-lg'>
				<p className='leading-[17px] text-sm text-primary'>
					Still haven't recevied your OTP ? kindly cross check your phone number
					by {""}
					<Button tag='a' onClick={showResendOtpModal} className='font-bold'>
						Clicking here
					</Button>
				</p>
			</div>
			{showModal && (
				<Modal onClose={() => setShowModal(false)} show={showModal}>
					<div className='text-center space-y-[7px]'>
						<h1 className='text-center text-2xl lg:text-[32px] font-bold text-secondary'>
							Edit your Phone Number
						</h1>
						<p className='text-accent-gray lg:text-lg leading-[29px]'>
							Cross check your number or enter another phone number to receive
							your OTP
						</p>
					</div>
					<form onSubmit={handleSubmitPhone(editPhone)} className='space-y-6'>
						<Controller
							name='phone'
							control={controlPhone}
							rules={{
								required: "phone number is required",
							}}
							render={({ field: { onChange, value } }) => (
								<Input
									label='Phone number'
									id='phone'
									type='tel'
									placeholder='Your Phone Number'
									onChange={(e) =>
										onChange(e.target.value.replace(/[^0-9.+]/g, ""))
									}
									value={value}
									errors={[errorsPhone?.phone?.message]}
									focused={true}
									required
								/>
							)}
						/>
						<br />
						<Button
							disabled={!isValidPhone}
							loading={isLoading}
							type='submit'
							className='w-full'>
							Resend OTP
						</Button>
					</form>
				</Modal>
			)}
		</section>
	);
};

export default VerifyPhone;
