import Button from "@/components/global/Button";
import Input from "@/components/global/Input";
import WhiteWrapper from "@/components/global/WhiteWrapper";
import { requireAuthentication } from "@/hoc/requireAuthentication";
import DefaultLayout from "@/layouts/DefaultLayout";
import { UpgradeAccountRequest } from "@/types/user/user";
import { GetServerSideProps, NextPage } from "next";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useUpgradeAccountMutation } from "src/services/user";
import Cookie from "js-cookie";
import { fileUploadValidation } from "@/helpers/fileUploadValidation";
import Router from "next/router";

const UpgradeAccount: NextPage = () => {
	const token = Cookie.get("kadavraToken");

	const {
		formState: { errors, isValid },
		handleSubmit,
		control,
		watch,
		setValue,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			utility: undefined,
			governmentId: undefined,
		},
	});

	const utility = watch("utility");

	const governmentId = watch("governmentId");

	const [upgradeAccount, { isLoading }] = useUpgradeAccountMutation();

	const onSubmit: SubmitHandler<UpgradeAccountRequest> = async (data) => {
		try {
			const formData = new FormData();
			formData.append("utility", data.utility[0]);
			formData.append("governmentId", data.governmentId[0]);

			const user = await upgradeAccount({
				token: token,
				body: formData,
				utility: "",
				governmentId: "",
			}).unwrap();
			toast.success(user.responseDescription);
			Router.push("/my-account");
		} catch (err) {
			toast.error(err?.data?.responseDescription || err?.data?.title);
		}
	};

	return (
		<DefaultLayout goBack={true} title='Upgrade Account'>
			<WhiteWrapper>
				<div className='grid grid-cols-1 sm:grid-cols-7 gap-0 sm:gap-8'>
					<article className='col-span-2'>
						<h3 className='text-secondary font-bold text-lg md:text-xl mb-2'>
							Upgrade your Account
						</h3>
						{/* <p className='text-accent-gray font-medium w-full text-sm md:text-base sm:max-w-[230px] leading-[22px]'></p> */}
						<hr className='my-8 sm:hidden' />
					</article>
					<section className='col-span-5'>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className='w-full xl:max-w-[70%] space-y-4'>
							<div className='space-y-4'>
								<div className='space-y-2 '>
									<h3 className='text-secondary font-bold text-lg md:text-xl'>
										Upload your Utility bill
									</h3>
									<p className='text-accent-gray text-sm md:text-base font-medium leading-[22px]'>
										Please upload a recent utility bill.
									</p>
								</div>
								{/* <SelectInput
									className='text-secondary'
									theme='outline'
									name='Utility Bill'
									option='Select your utility'
									options={["Nepa", "Water Bill", "Electricity Bill"]}
									caretColor='#5A5C5C'
								/> */}
								{utility ? (
									<>
										<div className='w-full dashed-file text-center flex-col flex justify-center items-center cursor-pointer gap-2 md:gap-4 py-6 px-10 bg-[#F8F8FD] rounded-[8px] outline-none'>
											<svg
												width='32'
												height='32'
												viewBox='0 0 32 32'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'>
												<path
													d='M20 10.668H20.0133'
													stroke='#0EA579'
													strokeWidth='2'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
												<path
													d='M22.6668 5.33203H9.3335C7.12436 5.33203 5.3335 7.12289 5.3335 9.33203V22.6654C5.3335 24.8745 7.12436 26.6654 9.3335 26.6654H22.6668C24.876 26.6654 26.6668 24.8745 26.6668 22.6654V9.33203C26.6668 7.12289 24.876 5.33203 22.6668 5.33203Z'
													stroke='#0EA579'
													strokeWidth='2'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
												<path
													d='M5.3335 19.9999L10.6668 14.6666C11.2749 14.0815 11.9647 13.7734 12.6668 13.7734C13.369 13.7734 14.0588 14.0815 14.6668 14.6666L21.3335 21.3333'
													stroke='#0EA579'
													strokeWidth='2'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
												<path
													d='M18.6665 18.6679L19.9998 17.3346C20.6079 16.7494 21.2977 16.4414 21.9998 16.4414C22.702 16.4414 23.3918 16.7494 23.9998 17.3346L26.6665 20.0012'
													stroke='#0EA579'
													strokeWidth='2'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
											</svg>

											<span className='text-[#515B6F]'>
												<span className='text-primary'>Document Uploaded</span>
												<div className='text-[#515B6F]'>{utility[0]?.name}</div>
											</span>

											<Button
												size='sm'
												onClick={() =>
													setValue("utility", "", {
														shouldValidate: true,
													})
												}>
												Remove
											</Button>
										</div>
										{errors?.utility?.message && (
											<span className='text-error text-sm text-accents-red'>
												{errors?.utility?.message.toString()}
											</span>
										)}
									</>
								) : (
									<Controller
										name='utility'
										control={control}
										rules={{
											validate: (value) => fileUploadValidation(value, "file"),
											required: "Utility bill is required",
										}}
										render={({ field: { onChange, value } }) => (
											<Input
												error={errors?.utility?.message}
												onChange={(e) => onChange(e.target.files)}
												value={value}
												type='file'
											/>
										)}
									/>
								)}
							</div>

							<div className='space-y-4'>
								<div className='space-y-2 '>
									<h3 className='text-secondary font-bold text-lg md:text-xl'>
										Upload your Government ID
									</h3>
									<p className='text-accent-gray text-sm md:text-base font-medium leading-[22px]'>
										Please upload a valid government means of identification to
										proceed with your account upgrade request.
									</p>
								</div>
								{/* <SelectInput
									className='text-secondary'
									theme='outline'
									name='Utility Bill'
									option='Select your Government ID'
									options={[
										"NIN",
										"Passport",
										"Driving License",
										"Voter ID",
										"BVN",
									]}
									caretColor='#5A5C5C'
								/> */}
								{governmentId ? (
									<>
										<div className='w-full dashed-file text-center flex-col flex justify-center items-center cursor-pointer gap-2 md:gap-4 py-6 px-10 bg-[#F8F8FD] rounded-[8px] outline-none'>
											<svg
												width='32'
												height='32'
												viewBox='0 0 32 32'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'>
												<path
													d='M20 10.668H20.0133'
													stroke='#0EA579'
													strokeWidth='2'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
												<path
													d='M22.6668 5.33203H9.3335C7.12436 5.33203 5.3335 7.12289 5.3335 9.33203V22.6654C5.3335 24.8745 7.12436 26.6654 9.3335 26.6654H22.6668C24.876 26.6654 26.6668 24.8745 26.6668 22.6654V9.33203C26.6668 7.12289 24.876 5.33203 22.6668 5.33203Z'
													stroke='#0EA579'
													strokeWidth='2'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
												<path
													d='M5.3335 19.9999L10.6668 14.6666C11.2749 14.0815 11.9647 13.7734 12.6668 13.7734C13.369 13.7734 14.0588 14.0815 14.6668 14.6666L21.3335 21.3333'
													stroke='#0EA579'
													strokeWidth='2'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
												<path
													d='M18.6665 18.6679L19.9998 17.3346C20.6079 16.7494 21.2977 16.4414 21.9998 16.4414C22.702 16.4414 23.3918 16.7494 23.9998 17.3346L26.6665 20.0012'
													stroke='#0EA579'
													strokeWidth='2'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
											</svg>

											<span className='text-[#515B6F]'>
												<span className='text-primary'>Document Uploaded</span>
												<div className='text-[#515B6F]'>
													{governmentId[0]?.name}
												</div>
											</span>

											<Button
												size='sm'
												onClick={() =>
													setValue("governmentId", "", {
														shouldValidate: true,
													})
												}>
												Remove
											</Button>
										</div>
										{errors?.governmentId?.message && (
											<span className='text-error text-sm text-accents-red'>
												{errors?.governmentId?.message.toString()}
											</span>
										)}
									</>
								) : (
									<Controller
										name='governmentId'
										control={control}
										rules={{
											validate: (value) => fileUploadValidation(value, "file"),
											required: "Government ID is required",
										}}
										render={({ field: { onChange, value } }) => (
											<Input
												error={errors?.governmentId?.message}
												onChange={(e) => onChange(e.target.files)}
												value={value}
												type='file'
											/>
										)}
									/>
								)}
							</div>
							<div className='pt-3'>
								<Button
									disabled={
										!isValid ||
										Boolean(errors?.utility?.message) ||
										Boolean(errors?.governmentId?.message)
									}
									type='submit'
									loading={isLoading}
									size='sm'>
									Submit
								</Button>
							</div>
						</form>
					</section>
				</div>
			</WhiteWrapper>
		</DefaultLayout>
	);
};

export default UpgradeAccount;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
	async (context) => {
		return {
			props: {},
		};
	}
);
