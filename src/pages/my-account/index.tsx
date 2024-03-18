import Button from "@/components/global/Button";
import Input from "@/components/global/Input";
import StatusPill from "@/components/global/StatusPill";
import WhiteWrapper from "@/components/global/WhiteWrapper";
import { requireAuthentication } from "@/hoc/requireAuthentication";
import DefaultLayout from "@/layouts/DefaultLayout";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { wrapper } from "src/app/store";
import {
	getRunningOperationPromises,
	getUser,
	useChangePasswordMutation,
	useDeactivateAccountMutation,
} from "src/services/user";
import Cookie from "js-cookie";

const MyAccount: NextPage = ({ user }: UserResponse) => {
	const router = useRouter();

	const token = Cookie.get("kadavraToken");

	// const [editPhoneNumber, setEditPhoneNumber] = useState(false);
	// const [editEmail, setEditEmail] = useState(false);
	// const [editPassword, setEditPassword] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);

	const {
		formState: { errors, isValid },
		handleSubmit,
		control,
		getValues,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			password: "",
			newPassword: "",
			confirmNewPassword: "",
		},
	});

	const [changePassword, { isLoading }] = useChangePasswordMutation();

	const onSubmit: SubmitHandler<ChangePasswordRequest> = async (data) => {
		try {
			const user = await changePassword({
				token: token,
				password: data.password,
				newPassword: data.newPassword,
				confirmNewPassword: data.confirmNewPassword,
			}).unwrap();
			toast.success(user.responseDescription);
			setShowModal(false);
		} catch (err) {
			toast.error(err?.data?.responseDescription || err?.data?.title);
		}
	};

	const logout = () => {
		Cookies.remove("kadavraUserDetails");
		Cookies.remove("kadavraToken");
		setTimeout(() => router.push("/auth/login"), 1000);
	};

	const [deactivate, { isLoading: deactivating }] =
		useDeactivateAccountMutation();

	const deactivateUser = async (e) => {
		e.preventDefault();
		try {
			const user = await deactivate({ token }).unwrap();
			toast.success("Account deactivated successfully");
			setShowModal(false);
			logout();
		} catch (err) {
			toast.error(err?.data?.responseDescription || err?.data?.title);
		}
	};

	return (
		<DefaultLayout title='My Account'>
			<section className='space-y-8'>
				<section>
					<span className='text-secondary text-xl lg:text-3xl font-medium mb-3 block'>
						{user.firstName} {user.lastName}
					</span>
					{user.tier === 1 && (
						<WhiteWrapper className=''>
							<div className='flex flex-col-reverse md:flex-row lg:items-center justify-between gap-6'>
								<div className='w-full xl:max-w-[70%]'>
									<h2 className='text-secondary font-bold text-xl lg:text-2xl mb-2'>
										Upgrade your Account
									</h2>
									<p className='text-sm lg:text-lg text-accent-gray leading-[29px] mb-5'>
										Upgrade your account to take off transaction limits and take
										advantage of all Kadavra services now!
									</p>
									<Button
										className='w-full md:w-auto'
										size='sm'
										onClick={() => router.push("/my-account/upgrade-account")}>
										Upgrade
									</Button>
								</div>
								<img
									src='/assets/images/my-account/my-account.svg'
									className='w-[167px] xl:w-auto'
									alt=''
								/>
							</div>
						</WhiteWrapper>
					)}
				</section>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
					<WhiteWrapper title='Your Account Status'>
						<div className='flex items-center justify-between'>
							<span className='text-sm'>Account Status</span>
							<StatusPill
								status={user.tier === 1 ? "Incomplete" : "Completed"}
							/>
						</div>
					</WhiteWrapper>

					{/* <WhiteWrapper title='Your Security Details'>
						<div className='flex items-center justify-between'>
							<span className='text-sm'>Login History</span>
							<Button size='sm'>View</Button>
						</div>
					</WhiteWrapper> */}

					<WhiteWrapper title='Your Contact Details'>
						<div className='flex items-center justify-between mb-3'>
							<span className='text-sm'>Phone Number</span>
							<span className='text-sm'>+{user.phoneNumber}</span>
						</div>

						<div className='flex items-center justify-between'>
							<span className='text-sm'>Email Address</span>
							<span className='text-sm'>{user.email}</span>
						</div>

						{/* <form className='flex items-center justify-between gap-3'>
							<span className='text-sm'>Email Address</span>
							<Input
								theme={editEmail ? "outline" : "plain"}
								placeholder='Email address'
								disabled={!editEmail}
								focused={editEmail}
								type='email'
								value='johndoe@gmail.com'
							/>
							<Button
								onClick={() => setEditEmail((state) => !state)}
								size='sm'
								className='w-[74px]'>
								{editEmail ? "Save" : "Edit"}
							</Button>
						</form> */}
					</WhiteWrapper>

					<WhiteWrapper title='Password'>
						<form className='flex items-center justify-between gap-3'>
							<span className='text-sm'>Password</span>
							<span className='text-sm'>********</span>
							<Button
								onClick={() => setShowModal((state) => !state)}
								size='sm'
								className='w-[74px]'>
								Change
							</Button>
						</form>
					</WhiteWrapper>

					<WhiteWrapper title='Deactivate Account'>
						<form className='flex items-center justify-center gap-3'>
							<Button
								loading={deactivating}
								type='button'
								onClick={() => setDeleteModal(true)}
								size='sm'
								className=''>
								Deactivate Account
							</Button>
						</form>
					</WhiteWrapper>
				</div>
				{deleteModal && (
					<Modal onClose={() => setDeleteModal(false)} show={deleteModal}>
						<div className='space-y-[7px]'>
							<h1 className='text-center text-2xl lg:text-[32px] font-bold text-secondary'>
								Deactivate Account
							</h1>
							<p className='text-sm lg:text-base p-3 text-accent-gray border-l-4 border-primary bg-[#1EB53A1A]'>
								<span className='font-bold'>N.B:</span> Please be informed that
								once your account is deactivated, all information on the account
								is deleted. You will be required to restart registration to
								continue using KADAVRA. exchange.
							</p>
						</div>
						<form onSubmit={deactivateUser} className='space-y-6'>
							<Button
								onClick={() => setDeleteModal(false)}
								type='button'
								className='w-full'>
								Cancel
							</Button>
							<Button
								theme='plain'
								loading={deactivating}
								type='submit'
								className='w-full text-white bg-error rounded-[5px]'>
								Deactivate
							</Button>
						</form>
					</Modal>
				)}
				{showModal && (
					<Modal onClose={() => setShowModal(false)} show={showModal}>
						<div className='text-center space-y-[7px]'>
							<h1 className='text-center text-2xl lg:text-[32px] font-bold text-secondary'>
								Change your password
							</h1>
							<p className='text-accent-gray lg:text-lg leading-[29px]'>
								Fill up the inputs available to change your password
							</p>
						</div>
						<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
							<Controller
								name='password'
								control={control}
								rules={{
									required: {
										value: true,
										message: "Password is required",
									},
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
								name='confirmNewPassword'
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
										errors={[errors?.confirmNewPassword?.message]}
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
					</Modal>
				)}
			</section>
		</DefaultLayout>
	);
};

export default MyAccount;

import { ChangePasswordRequest, UserResponse } from "@/types/user/user";
import Modal from "@/components/global/Modal";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { passwordValidation } from "@/helpers/passwordValidation";
import Cookies from "js-cookie";

export const getServerSideProps: GetServerSideProps = requireAuthentication(
	wrapper.getServerSideProps((store) => async (context) => {
		const token = context.req.cookies.kadavraToken;

		store.dispatch(getUser.initiate(token));

		try {
			const response = await Promise.all(getRunningOperationPromises());
			console.log(response);
			return {
				props: {
					user: response[0]["data"].user,
				},
			};
		} catch (error) {
			console.log(error);
			toast.error(error?.data?.responseDescription);
			return {
				props: {
					user: {},
				},
			};
		}
	})
);
