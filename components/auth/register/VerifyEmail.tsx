import Button from "@/components/global/Button";
import Input from "@/components/global/Input";
import Modal from "@/components/global/Modal";
import OTP from "@/components/global/OTP";
import { VerifyEmailOTPRequest } from "@/types/auth/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
	useGenerateEmailOTPMutation,
	useVerifyEmailOTPMutation,
} from "src/services/auth";

type VerifyEmailProps = {
	getLoading?: (val: boolean) => void;
};

const VerifyEmail = ({ getLoading }: VerifyEmailProps) => {
	const [showModal, setShowModal] = useState(false);

	const router = useRouter();

	const { email, id, bvn } = router.query;

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
		formState: { errors: errorsEmail, isValid: isValidEmail },
		handleSubmit: handleSubmitEmail,
		control: controlEmail,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			email: email.toString(),
		},
	});

	const [generateOTP, { isLoading }] = useGenerateEmailOTPMutation();

	useEffect(() => {
		getLoading(isLoading);
	}, [isLoading]);

	const handleGenerateOTP = async (newEmail?: string) => {
		try {
			const response = await generateOTP({
				registrationId: id.toString(),
				bvn: bvn.toString(),
				email: newEmail || email.toString(),
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
		useVerifyEmailOTPMutation();

	const onSubmit: SubmitHandler<VerifyEmailOTPRequest> = async (data) => {
		try {
			await verifyOTP({
				registrationId: id.toString(),
				bvn: bvn.toString(),
				email: email.toString(),
				otp: data.otp,
			}).unwrap();
			toast.success("OTP verified successfully");
			router.push({
				pathname: router.pathname,
				query: {
					...router.query,
					step: "register-user",
				},
			});
		} catch (err) {
			toast.error(err?.data?.responseDescription);
		}
	};

	const editEmail = async (data: any) => {
		await router.replace({
			pathname: router.pathname,
			query: {
				...router.query,
				email: data.email,
			},
		});
		handleGenerateOTP(data.email);
	};

	const showResendOtpModal = (e: any) => {
		e.preventDefault();
		setShowModal(true);
	};

	return (
		<section>
			<div className='text-center space-y-[7px] mb-10'>
				<h1 className='text-center text-2xl lg:text-[32px] font-bold text-secondary'>
					Verify your Email
				</h1>
				<p className='text-accent-gray lg:text-lg leading-[29px]'>
					We sent an OTP to {email}.
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
							label='Enter Verification Code'
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
					Still haven't recevied your OTP ? kindly cross check your email by{" "}
					{""}
					<Button tag='a' onClick={showResendOtpModal} className='font-bold'>
						Clicking here
					</Button>
				</p>
			</div>
			{showModal && (
				<Modal onClose={() => setShowModal(false)} show={showModal}>
					<div className='text-center space-y-[7px]'>
						<h1 className='text-center text-2xl lg:text-[32px] font-bold text-secondary'>
							Edit your Email
						</h1>
						<p className='text-accent-gray lg:text-lg leading-[29px]'>
							Cross check your email or enter another email to receive your OTP
						</p>
					</div>
					<form onSubmit={handleSubmitEmail(editEmail)} className='space-y-6'>
						<Controller
							name='email'
							control={controlEmail}
							rules={{
								required: "email number is required",
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
									message: "Invalid email address",
								},
							}}
							render={({ field: { onChange, value } }) => (
								<Input
									onChange={onChange}
									value={value}
									errors={[errorsEmail?.email?.message]}
									label='Email'
									type='email'
									id='email'
									placeholder='Your Email'
									focused={true}
									required
								/>
							)}
						/>
						<br />
						<Button
							disabled={!isValidEmail}
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

export default VerifyEmail;
