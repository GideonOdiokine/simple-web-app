import Button from "@/components/global/Button";
import Input from "@/components/global/Input";
import OTP from "@/components/global/OTP";
import { passwordValidation } from "@/helpers/passwordValidation";
import { checkAuthentication } from "@/hoc/checkAuthentication";
import AuthLayout from "@/layouts/AuthLayout";
import { ResetPasswordRequest } from "@/types/auth/auth";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useResetPasswordMutation } from "src/services/auth";

const ResetPassword: NextPage = () => {
	const router = useRouter();

	const { step, userName } = router.query;

	const {
		formState: { errors, isValid },
		handleSubmit,
		control,
		getValues,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			newPassword: "",
			confirmPassword: "",
			userName: "",
			otp: "",
		},
	});

	const [resetPassword, { isLoading }] = useResetPasswordMutation();

	const onSubmit: SubmitHandler<ResetPasswordRequest> = async (data) => {
		try {
			const user = await resetPassword({
				newPassword: data.newPassword,
				confirmPassword: data.confirmPassword,
				userName: userName.toString(),
				otp: data.otp,
			}).unwrap();
			console.log(user);
			toast.success("Reset Password successful");
			router.replace({
				pathname: router.pathname,
				query: { ...router.query, step: "success" },
			});
		} catch (err) {
			toast.error(err?.data?.responseDescription || err?.data?.title);
		}
	};

	return (
		<AuthLayout>
			{step === "1" ||
				(step === undefined && (
					<Fragment>
						<div className='text-center space-y-[7px]'>
							<h1 className='text-center text-2xl lg:text-[32px] font-bold text-secondary'>
								Reset Password
							</h1>
							<p className='text-accent-gray lg:text-lg leading-[29px]'>
								Reset your password
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
									/>
								)}
							/>
							<Controller
								name='newPassword'
								control={control}
								rules={{
									validate: (value) => passwordValidation(value, "password"),
								}}
								render={({ field: { onChange, value } }) => (
									<Input
										onChange={onChange}
										value={value}
										label='Password'
										type='password'
										placeholder='Your Password'
										errors={[errors?.newPassword?.message]}
									/>
								)}
							/>
							<Controller
								name='confirmPassword'
								control={control}
								rules={{
									required: "confirm password is required",
									validate: (value) =>
										value === getValues("newPassword") ||
										"Passwords does not match",
								}}
								render={({ field: { onChange, value } }) => (
									<Input
										onChange={onChange}
										value={value}
										label='Confirm Password'
										type='password'
										placeholder='Confirm your Password'
										errors={[errors?.confirmPassword?.message]}
									/>
								)}
							/>
							<br />
							<Button
								className='w-full'
								disabled={!isValid}
								loading={isLoading}
								type='submit'>
								Submit
							</Button>
						</form>
					</Fragment>
				))}

			{step === "success" && (
				<Fragment>
					<div className='text-center space-y-[7px]'>
						<img
							className='mx-auto mb-7 w-[130px] md:w-auto'
							src='/assets/images/reset-password-success.svg'
							alt=''
						/>
						<h1 className='text-center text-2xl lg:text-[32px] font-bold text-secondary'>
							Reset Successful!
						</h1>
						<p className='text-accent-gray lg:text-lg leading-[29px]'>
							You can now login into your account
						</p>
					</div>
					<form className='space-y-6'>
						<Button
							className='w-full'
							onClick={() => router.push("/auth/login")}>
							Go to Login
						</Button>
					</form>
				</Fragment>
			)}
		</AuthLayout>
	);
};

export default ResetPassword;

export const getServerSideProps: GetServerSideProps = checkAuthentication(
	async (context) => {
		return {
			props: {},
		};
	}
);
