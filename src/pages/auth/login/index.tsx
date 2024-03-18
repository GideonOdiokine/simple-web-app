import Button from "@/components/global/Button";
import Input from "@/components/global/Input";
import AuthLayout from "@/layouts/AuthLayout";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { useLoginMutation } from "src/services/auth";
import Cookies from "js-cookie";
import { checkAuthentication } from "@/hoc/checkAuthentication";
import { LoginRequest } from "@/types/auth/auth";
import { useSelector } from "react-redux";
import { AppState } from "src/app/store";

const Login: NextPage = () => {
	const router = useRouter();
	const sessionTimedOut = useSelector(
		(state: AppState) => state.authReducer.sessionTimedOut
	);

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

	const initiatRoute = router.query.ref
		? Object.entries(router.query)
				.map((item) => item.join("="))
				.sort((a, b) => (a.toString().includes("ref=") ? -1 : 1))
				.join("&")
				.replace("ref=", "")
				.toString()
		: "/";

	const [login, { isLoading }] = useLoginMutation();

	const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
		try {
			const body = {
				...data,
				userName: data.userName.startsWith("0")
					? `234${data.userName.slice(1)}`
					: data.userName.replace(/[+]/g, ""),
			};
			const user = await login(body).unwrap();
			toast.success("Login successful");
			Cookies.set("kadavraUserDetails", JSON.stringify(user), {
				expires: 1 / 24,
			});
			Cookies.set("kadavraToken", user.token, { expires: 1 / 24 });
			if (sessionTimedOut) router.back();
			else await router.push(initiatRoute);
		} catch (err) {
			toast.error(err.data.responseDescription);
		}
	};

	return (
		<AuthLayout>
			<div className='text-center space-y-[7px]'>
				<h1 className='text-center text-2xl lg:text-[32px] font-bold text-secondary'>
					{sessionTimedOut ? "Session Timed Out" : "Welcome Back"}
				</h1>
				{!sessionTimedOut && (
					<p className='text-accent-gray lg:text-lg leading-[29px]'>
						Login to continue
					</p>
				)}
			</div>
			<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
				{sessionTimedOut && (
					<p className='text-sm p-3 text-left text-accent-gray border-l-4 border-accent-yellow bg-[#b3b51e1a]'>
						Your Session <b>Timed Out</b>. Please login to continue
						<br />
						from where you stopped
					</p>
				)}
				<Controller
					name='userName'
					control={control}
					rules={{ required: "username is required" }}
					render={({ field: { onChange, value } }) => (
						<Input
							label='Phone number/Email'
							placeholder='Your Phone number/Email'
							focused={true}
							type='text'
							id='email'
							onChange={onChange}
							value={value}
							errors={[errors?.userName?.message]}
						/>
					)}
				/>

				<Controller
					name='password'
					control={control}
					rules={{
						required: "password is required",
					}}
					render={({ field: { onChange, value } }) => (
						<Input
							onChange={onChange}
							value={value}
							label='Password'
							type='password'
							placeholder='Your Password'
							errors={[errors?.password?.message]}
						/>
					)}
				/>

				<div className='flex items-center justify-between'>
					{/* <Checkbox label='Remember Me' id='rememberMe' /> */}
					<Button tag='a' className='font-bold' href='/auth/forgot-password'>
						Forgot Password?
					</Button>
				</div>
				<br />
				<Button
					disabled={!isValid}
					className='w-full'
					type='submit'
					loading={isLoading}>
					Login
				</Button>
				<div className='text-center md:text-left'>
					Don’t have an account?{" "}
					<Button
						tag='a'
						href='/auth/register'
						className='text-primary font-bold'>
						Register
					</Button>
				</div>
			</form>
		</AuthLayout>
	);
};

export default Login;

export const getServerSideProps: GetServerSideProps = checkAuthentication(
	async (context) => {
		return {
			props: {},
		};
	}
);
