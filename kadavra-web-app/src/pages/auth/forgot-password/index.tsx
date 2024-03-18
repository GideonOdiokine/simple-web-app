import Button from "@/components/global/Button";
import Input from "@/components/global/Input";
import { checkAuthentication } from "@/hoc/checkAuthentication";
import AuthLayout from "@/layouts/AuthLayout";
import { GenerateForgotPasswordRequest } from "@/types/auth/auth";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useGenerateForgetPasswordOTPMutation } from "src/services/auth";

const ForgotPassword: NextPage = () => {
	const router = useRouter();

	const {
		formState: { errors, isValid },
		handleSubmit,
		control,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			userName: "",
			password: "",
		},
	});

	const [generateOTP, { isLoading }] = useGenerateForgetPasswordOTPMutation();

	const onSubmit: SubmitHandler<GenerateForgotPasswordRequest> = async (
		data
	) => {
		try {
			const user = await generateOTP(data).unwrap();
			toast.success(user.responseDescription);
			router.push({
				pathname: "/auth/reset-password",
				query: {
					...router.query,
					userName: data.userName,
				},
			});
		} catch (err) {
			toast.error(err.data.responseDescription);
		}
	};

	return (
		<AuthLayout>
			<div className='text-center space-y-[7px]'>
				<h1 className='text-center text-2xl lg:text-[32px] font-bold text-secondary'>
					Forget Password
				</h1>
				<p className='text-accent-gray lg:text-lg leading-[29px]'>
					Enter the email associated with your account and we’ll send an email
					with instruction to reset your Password
				</p>
			</div>
			<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
				<Controller
					name='userName'
					control={control}
					rules={{
						required: "email is required",
						pattern: {
							value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
							message: "Invalid email address",
						},
					}}
					render={({ field: { onChange, value } }) => (
						<Input
							label='Email'
							placeholder='Your Email'
							focused={true}
							type='email'
							onChange={onChange}
							value={value}
							errors={[errors?.userName?.message]}
						/>
					)}
				/>
				<br />
				<Button
					disabled={!isValid}
					loading={isLoading}
					type='submit'
					className='w-full'>
					Submit
				</Button>
			</form>
		</AuthLayout>
	);
};

export default ForgotPassword;

export const getServerSideProps: GetServerSideProps = checkAuthentication(
	async (context) => {
		return {
			props: {},
		};
	}
);
