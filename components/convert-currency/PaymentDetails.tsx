import { useRouter } from "next/router";
import {
	useConfirmPaymentMutation,
	useGetBanksMutation,
	useValidateAccountMutation,
	useVerifyDirectDebitOTPMutation,
} from "src/services/transactions";
import Button from "../global/Button";
import Input from "../global/Input";
import WhiteWrapper from "../global/WhiteWrapper";
import Cookies from "js-cookie";
import {
	ConfirmPaymentRequest,
	VerifyDirectDebitOTPRequest,
} from "@/types/transactions/transactions";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import SelectInput from "../global/SelectInput";
import { useEffect, useState } from "react";
import { BankType } from "./CreditDetails";

const PaymentDetails = () => {
	const [banks, setBanks] = useState<BankType[]>();
	const [showOtp, setShowOtp] = useState(false);
	const [flwRef, setflwRef] = useState("");

	const router = useRouter();

	const token = Cookies.get("kadavraToken");

	const { to, from, convertDetails, reference } = router.query;

	useEffect(() => {
		setShowOtp(false);
	}, [convertDetails]);

	const {
		formState: { errors, isValid },
		handleSubmit,
		control,
		watch,
		setValue,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			reference: reference.toString(),
			paymentChannel: (convertDetails.toString() as string) || "",
			bank: null,
			accountNumber: "",
			accountName: "",
		},
	});

	const {
		formState: { errors: errors2, isValid: isValid2 },
		handleSubmit: handleSubmit2,
		control: control2,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			otp: "",
		},
	});

	const [getBanks, { isLoading: isLoadingBanks }] = useGetBanksMutation();

	useEffect(() => {
		async function _getBanks() {
			try {
				const response = (await getBanks({
					token,
					country: "NG",
				}).unwrap()) as any;
				setBanks(response.data);
			} catch (err) {
				toast.error(err?.data?.responseDescription);
			}
		}
		_getBanks();
	}, []);

	const bank = watch("bank");

	const accountNumber = watch("accountNumber");

	const [validateAccount, { isLoading: isLoadingValidate }] =
		useValidateAccountMutation();

	useEffect(() => {
		async function _validateAccount() {
			if (
				bank?.value &&
				from.toString() === "NGN" &&
				accountNumber?.length === 10
			) {
				try {
					const response = (await validateAccount({
						token,
						body: {
							bankCode: bank?.value,
							accountNumber,
						},
					}).unwrap()) as any;
					setValue("accountName", response.data.accountName);
					toast.success("Account validated successfully");
				} catch (err) {
					toast.error(err?.data?.responseDescription);
				}
			}
		}
		_validateAccount();
	}, [bank, accountNumber]);

	const [createPayment, { isLoading }] = useConfirmPaymentMutation();

	const [verifyOTP, { isLoading: isLoading2 }] =
		useVerifyDirectDebitOTPMutation();

	const onSubmit: SubmitHandler<ConfirmPaymentRequest | any> = async (data) => {
		try {
			const request = {
				token,
				body: {
					reference: (reference as string) || "",
					paymentChannel: (convertDetails.toString() as string) || "",
					accountNumber:
						(convertDetails.toString() as string) !== "card"
							? data.accountNumber
							: undefined,
					accountName:
						(convertDetails.toString() as string) !== "card"
							? data.accountName
							: undefined,
					bankCode:
						(convertDetails.toString() as string) !== "card"
							? data.bank?.value
							: undefined,
					bankName:
						(convertDetails.toString() as string) !== "card"
							? data.bank?.label
							: undefined,
				},
			};
			const payment = (await createPayment(request as any).unwrap()) as any;
			// console.log(payment);
			if (convertDetails.toString() === "card" && payment?.data?.paymentLink) {
				window.location.href = payment.data.paymentLink;
				// window.open(
				// 	payment.data.paymentLink,
				// 	"popUpWindow",
				// 	"height=500,width=500,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes"
				// );
			}

			if (
				convertDetails.toString() === "bank_account" &&
				payment?.data?.mode === "redirect"
			) {
				window.location.href = payment.data.redirect;
			}

			if (
				convertDetails.toString() === "bank_account" &&
				payment?.data?.mode === "otp"
			) {
				setShowOtp(true);
				setflwRef(payment.data.flwRef);
			} else {
				setShowOtp(false);
				setflwRef("");
			}
			// window.open(payment.data.paymentLink, "_blank", "width=200,height=400");
		} catch (err) {
			toast.error(err.data.responseDescription);
		}
	};

	const onSubmit2: SubmitHandler<VerifyDirectDebitOTPRequest | any> = async (
		data
	) => {
		try {
			const request = {
				token,
				body: {
					otp: data.otp,
					flwRef,
				},
			};
			const result = (await verifyOTP(request as any).unwrap()) as any;
			// console.log(result);
		} catch (err) {
			toast.error(err.data.responseDescription);
		}
	};
	return (
		<WhiteWrapper isLoading={isLoading || isLoadingBanks || isLoadingValidate}>
			<div className='grid grid-cols-1 sm:grid-cols-7 gap-0 sm:gap-8'>
				<article className='col-span-2'>
					<h3 className='text-secondary font-bold text-lg md:text-xl mb-2'>
						Payment Details
					</h3>
					<p className='text-accent-gray font-medium w-full text-sm md:text-base sm:max-w-[230px] leading-[22px]'>
						Select your payment option.
					</p>
					<hr className='my-8 sm:hidden' />
				</article>

				<section className='col-span-5'>
					<div className='flex items-center gap-8 mb-8'>
						<div className='form-check flex'>
							<input
								className='form-check-input appearance-none rounded-full h-6 w-6 border border-gray-300 bg-white checked:bg-primary checked:border-primary focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer'
								type='radio'
								name='convertDetails'
								id='card'
								value='convertDetails'
								checked={convertDetails === "card"}
								onChange={() =>
									router.replace({
										query: {
											...router.query,
											convertDetails: "card",
										},
									})
								}
							/>
							<label
								className='form-check-label mt-[5px] cursor-pointer w-[calc(100%-32px)] inline-block text-gray-800'
								htmlFor='card'>
								<div className='font-medium whitespace-nowrap'>Card</div>
							</label>
						</div>

						{from === "NGN" && (
							<div className='form-check flex'>
								<input
									className='form-check-input appearance-none rounded-full h-6 w-6 border border-gray-300 bg-white checked:bg-primary checked:border-primary focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer'
									type='radio'
									name='convertDetails'
									id='bankTransfer'
									value='bankTransfer'
									checked={convertDetails === "bank_account"}
									onChange={() =>
										router.replace({
											query: {
												...router.query,
												convertDetails: "bank_account",
											},
										})
									}
								/>
								<label
									className='form-check-label mt-[5px] cursor-pointer w-[calc(100%-32px)] inline-block text-gray-800'
									htmlFor='bankTransfer'>
									<div className='font-medium whitespace-nowrap'>
										Bank Account
									</div>
								</label>
							</div>
						)}
					</div>

					{!showOtp && (
						<form
							onSubmit={handleSubmit(onSubmit)}
							className='w-full xl:max-w-[70%] space-y-7'>
							{convertDetails === "card" && (
								<>
									<p className='text-lg font-semibold text-secondary'>
										You will be directed to our payment gateway
									</p>

									{/* <Switch label='Save Card' /> */}
								</>
							)}

							{from === "NGN" && convertDetails === "bank_account" && (
								<>
									<Controller
										name='bank'
										control={control}
										rules={{
											required: "Bank is required",
										}}
										render={({ field: { onChange, value } }) => (
											<SelectInput
												onChange={onChange}
												value={value}
												name='bank'
												searchable
												placeholder='Select Bank'
												options={banks

													?.map((bank) => {
														return {
															label: bank.name,
															value: bank.code,
														};
													})
													?.sort((a, b) => a?.label.localeCompare(b?.label))}
												label='Bank Name'
												theme='outline'
												caretColor='#061914'
												required
											/>
										)}
									/>

									<Controller
										name='accountNumber'
										control={control}
										rules={{
											required: "Account number is required",
											minLength: {
												value: 10,
												message: "Account number must be 10 digits",
											},
											maxLength: {
												value: 10,
												message: "Account number must be 10 digits",
											},
										}}
										render={({ field: { onChange, value } }) => (
											<Input
												onChange={(e) =>
													onChange(e.target.value.replace(/[^0-9.+]/g, ""))
												}
												value={value}
												label='Account Number'
												placeholder='Account Number'
												errors={[errors?.accountNumber?.message]}
												required
											/>
										)}
									/>

									<Controller
										name='accountName'
										control={control}
										rules={{
											required: "Account name is required",
										}}
										render={({ field: { onChange, value } }) => (
											<Input
												onChange={onChange}
												value={value}
												label='Account Name'
												placeholder='Account Name'
												errors={[errors?.accountName?.message]}
												disabled
												required
											/>
										)}
									/>

									{/* {to !== "NGN" && (
									<>
										<Controller
											name='firstName'
											control={control}
											rules={{
												required: "First name is required",
											}}
											render={({ field: { onChange, value } }) => (
												<Input
													onChange={onChange}
													value={value}
													label='First Name'
													placeholder='First Name'
													errors={[errors?.firstName?.message]}
												/>
											)}
										/>
										<Controller
											name='lastName'
											control={control}
											rules={{
												required: "Last name is required",
											}}
											render={({ field: { onChange, value } }) => (
												<Input
													onChange={onChange}
													value={value}
													label='Last Name'
													placeholder='Last Name'
													errors={[errors?.lastName?.message]}
												/>
											)}
										/>
									</>
								)} */}
								</>
							)}

							{to !== "NGN" && convertDetails === "bankTransfer" && (
								<>
									<p className='text-medium text-sm text-secondary'>
										kindly make your payment to this bank account Details below
									</p>
									<Input
										label='Bank name'
										placeholder='Bank name'
										value='First Bank'
										disabled
									/>
									<Input
										label='Account number'
										placeholder='Account number'
										value='0986875656'
										disabled
									/>
									<Input
										label='Account Name'
										placeholder='Account Name'
										value='kadavra'
										disabled
									/>
									<Input
										label='Narration'
										placeholder='Narration'
										value='CF33455567'
										disabled
									/>
									<p className='text-medium text-sm text-secondary'>
										After you’re make a payment, kindly upload your bank recepit
										below
									</p>
									<Input type='file' />
								</>
							)}

							<div className='flex flex-col md:flex-row items-center pt-2'>
								<Button
									type='submit'
									loading={isLoading}
									size='sm'
									className='w-full'>
									Continue with Payment
								</Button>
								<Button
									size='sm'
									theme='plain'
									className='w-full text-primary'
									onClick={() =>
										router.push({
											pathname: router.pathname,
											query: { ...router.query, step: "2" },
										})
									}>
									Previous Step
								</Button>
							</div>
						</form>
					)}

					{showOtp && (
						<form
							onSubmit={handleSubmit2(onSubmit2)}
							className='w-full xl:max-w-[70%] space-y-7'>
							<Controller
								name='otp'
								control={control2}
								rules={{
									required: "OTP is required",
								}}
								render={({ field: { onChange, value } }) => (
									<Input
										value={value}
										type='text'
										label='Enter Verification Code'
										placeholder='Enter Verification Code'
										autoFocus={true}
										onChange={onChange}
										required
										// errors={errors2?.otp?.message}
									/>
								)}
							/>
							<Button
								type='submit'
								loading={isLoading2}
								disabled={!isValid2}
								size='sm'
								className='w-full'>
								Continue with Payment
							</Button>
						</form>
					)}
				</section>
			</div>
		</WhiteWrapper>
	);
};

export default PaymentDetails;
