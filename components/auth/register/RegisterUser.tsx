import Button from "@/components/global/Button";
import Input from "@/components/global/Input";
import SelectInput from "@/components/global/SelectInput";
import { passwordValidation } from "@/helpers/passwordValidation";
import { RegisterUserRequest, RegisterUserResponse } from "@/types/auth/auth";
import { useRouter } from "next/router";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRegisterUserMutation } from "src/services/auth";

type Props = {
	getUser: (user: RegisterUserResponse) => void;
};

const RegisterUser = ({ getUser }: Props) => {
	const router = useRouter();

	const { id, bvn } = router.query;

	const {
		formState: { errors, isValid },
		handleSubmit,
		control,
		getValues,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			password: "",
			confirmPassword: "",
			address: "",
			gender: "Male",
		},
	});

	const [registerUser, { isLoading }] = useRegisterUserMutation();

	const onSubmit: SubmitHandler<RegisterUserRequest> = async (data) => {
		try {
			const user = await registerUser({
				registrationId: id.toString(),
				bvn: bvn.toString(),
				password: data.password,
				confirmPassword: data.confirmPassword,
				address: data.address,
				gender: data.gender,
			}).unwrap();
			getUser(user);
			toast.success("Registration successful");
			router.push({
				pathname: router.pathname,
				query: {
					...router.query,
					step: "success",
				},
			});
		} catch (err) {
			toast.error(err?.data?.responseDescription || err?.data?.title);
		}
	};

	return (
		<section>
			<div className='text-center space-y-[7px] mb-10'>
				<h1 className='text-center text-2xl lg:text-[32px] font-bold text-secondary'>
					Complete Your Registration
				</h1>
				<p className='text-accent-gray lg:text-lg leading-[29px]'>
					Let us get to know you better!
				</p>
			</div>
			<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
				<Controller
					name='address'
					control={control}
					rules={{
						required: "address is required",
					}}
					render={({ field: { onChange, value } }) => (
						<Input
							label='Address'
							id='address'
							type='text'
							placeholder='Your address'
							onChange={onChange}
							value={value}
							errors={[errors?.address?.message]}
							focused={true}
							required
						/>
					)}
				/>
				<Controller
					name='gender'
					control={control}
					rules={{
						required: "gender is required",
					}}
					render={({ field: { onChange, value } }) => (
						<SelectInput
							caretColor='#5A5C5C'
							theme='outline'
							placeholder='Select gender'
							name='gender'
							label='Gender'
							options={["Male", "Female"]}
							onChange={onChange}
							value={value}
							errors={[errors?.gender?.message]}
							required
						/>
					)}
				/>
				<Controller
					name='password'
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
							errors={[errors?.password?.message]}
							required
						/>
					)}
				/>
				<Controller
					name='confirmPassword'
					control={control}
					rules={{
						required: "confirm password is required",
						validate: (value) =>
							value === getValues("password") || "Passwords does not match",
					}}
					render={({ field: { onChange, value } }) => (
						<Input
							onChange={onChange}
							value={value}
							label='Confirm Password'
							type='password'
							placeholder='Confirm your Password'
							errors={[errors?.confirmPassword?.message]}
							required
						/>
					)}
				/>
				<br />
				<Button
					className='w-full'
					loading={isLoading}
					disabled={!isValid}
					type='submit'>
					Get Started
				</Button>
			</form>
		</section>
	);
};

export default RegisterUser;
