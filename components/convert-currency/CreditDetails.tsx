import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
	useCreatePaymentMutation,
	useGetAccountTypesMutation,
	useGetBanksMutation,
	useValidateAccountMutation,
} from "src/services/transactions";
import Button from "../global/Button";
import Input from "../global/Input";
import SelectInput from "../global/SelectInput";
import WhiteWrapper from "../global/WhiteWrapper";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CreatePaymentRequest } from "@/types/transactions/transactions";
import { useUpdateEffect } from "react-use";
import StatusPill from "../global/StatusPill";

export interface BankType {
	id: string;
	code: string;
	name: string;
}

const CreditDetails = () => {
	const router = useRouter();
	const [accountTypes, setAccountTypes] = useState<string[]>();
	const [banks, setBanks] = useState<BankType[]>();

	const { creditBankDetails, to, from, store, amount } = router.query;

	const {
		formState: { errors, isValid },
		handleSubmit,
		setValue,
		getValues,
		watch,
		control,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			accountType:
				to === "NGN"
					? "Local Account(Naira)"
					: to === "EUR" || to === "GBP"
					? "Euro Account (GBP/EUR)"
					: "",
			bank: null,
			accountNumber: "",
			accountName: "",
			firstName: "",
			lastName: "",
			email: "",
			senderCity: "",
			address: "",
			phone: "",
			beneficiaryOccupation: "",
			senderIDNumber: "",
			senderIdType: "",
			senderMobileNumber: "",
			senderAddress: "",
			senderIdExpiry: "",
			senderOccupation: "",
			relationshipToBeneficiary: "",
			transferPurpose: "",
			swiftCode: "",
			iban: "",
			routingNumber: "",
			country: "",
			postalCode: "",
			city: "",
			streetNumber: "",
			streetName: "",
		},
	});

	const token = Cookies.get("kadavraToken");

	const [getAccountTypes, { isLoading }] = useGetAccountTypesMutation();

	const [getBanks, { isLoading: isLoadingBanks }] = useGetBanksMutation();

	useEffect(() => {
		async function _getAccountTypes() {
			try {
				const response = (await getAccountTypes({
					token,
				}).unwrap()) as any;
				setAccountTypes(response.data);
			} catch (err) {
				toast.error(err?.data?.responseDescription);
			}
		}
		async function _getBanks() {
			if (to.toString() === "NGN") {
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
		}
		_getBanks();
		_getAccountTypes();
	}, []);

	const bank = watch("bank");

	const accountType = watch("accountType");

	useUpdateEffect(() => {
		async function _getBanks() {
			setValue("bank", null);
			setBanks(null);

			if (accountType === "Euro Account (GBP/EUR)") return;

			if (accountType === "Local Dom Account (USD) FCMB") {
				setValue(
					"bank",
					{
						label: "First City Monument Bank",
						value: "214",
					},
					{
						shouldValidate: true,
					}
				);
			}

			try {
				const response = (await getBanks({
					token,
					country:
						accountType === "Local Dom Account (USD)" ||
						accountType === "Local Dom Account (USD) FIDELITY/UNION"
							? "NG"
							: "US",
				}).unwrap()) as any;
				if (accountType === "Local Dom Account (USD) FIDELITY/UNION")
					setBanks(
						response.data.filter(
							(bank: any) =>
								bank.name.toLowerCase().includes("fidelity") ||
								bank.name.toLowerCase().includes("union")
						)
					);
				else if (accountType === "Local Dom Account (USD)")
					setBanks(
						response.data.filter(
							(bank: any) =>
								bank.name.toLowerCase().includes("fidelity bank") ||
								bank.name.toLowerCase().includes("zenith bank plc") ||
								bank.name.toLowerCase().includes("united bank for africa") ||
								bank.name.toLowerCase().includes("wema bank plc")
						)
					);
				else setBanks(response.data);
			} catch (err) {
				toast.error(err?.data?.responseDescription);
			}
		}
		_getBanks();
	}, [accountType]);

	const accountNumber = watch("accountNumber");

	const [validateAccount, { isLoading: isLoadingValidate }] =
		useValidateAccountMutation();

	useEffect(() => {
		async function _validateAccount() {
			if (
				bank?.value &&
				accountNumber?.length === 10 &&
				to.toString() === "NGN"
			) {
				try {
					const response = (await validateAccount({
						token,
						body: {
							bankCode: bank?.value,
							accountNumber,
						},
					}).unwrap()) as any;
					toast.success("Account validated successfully");
					setValue("accountName", response.data.accountName);
				} catch (err) {
					toast.error(err?.data?.responseDescription);
				}
			}
		}
		_validateAccount();
	}, [bank, accountNumber]);

	const [createPayment, { isLoading: isLoadingPayment }] =
		useCreatePaymentMutation();

	const onSubmit: SubmitHandler<CreatePaymentRequest | any> = async (data) => {
		try {
			const request = {
				token,
				body: {
					baseCurrency: from || "",
					targetCurrency: to || "",
					amount: Number(amount) || 0,
					recipient: {
						accountNumber: data.accountNumber,
						bankCode: data?.bank.value,
						bankName: data?.bank.label,
						accountName: data?.accountName,
						accountType: data?.accountType,
						firstName: data?.firstName || undefined,
						lastName: data?.lastName || undefined,
						email: data?.email || undefined,
						senderCity: data?.senderCity || undefined,
						address: data?.address || undefined,
						phone: data?.phone || undefined,
						beneficiaryOccupation: data?.beneficiaryOccupation || undefined,
						senderIDNumber: data?.senderIDNumber || undefined,
						senderIdType: data?.senderIdType || undefined,
						senderMobileNumber: data?.senderMobileNumber || undefined,
						senderAddress: data?.senderAddress || undefined,
						senderIdExpiry: data?.senderIdExpiry || undefined,
						senderOccupation: data?.senderOccupation || undefined,
						relationshipToBeneficiary:
							data?.relationshipToBeneficiary || undefined,
						transferPurpose: data?.transferPurpose || undefined,
						swiftCode: data?.swiftCode || undefined,
						routingNumber: data?.routingNumber || undefined,
						iban: data?.iban || undefined,
						country: data?.country || undefined,
						city: data?.city || undefined,
						streetNumber: data?.streetNumber || undefined,
						streetName: data?.streetName || undefined,
						postalCode: data.postalCode || undefined,
					},
				},
			};
			const payment = (await createPayment(request as any).unwrap()) as any;
			// console.log(payment);
			router.push({
				pathname: router.pathname,
				query: {
					step: "3",
					convertDetails: "card",
					reference: payment.data.reference,
					from,
					to,
				},
			});
		} catch (err) {
			toast.error(err.data.responseDescription);
		}
	};

	return (
		<WhiteWrapper
			isLoading={
				isLoading || isLoadingBanks || isLoadingValidate || isLoadingPayment
			}>
			<div className='grid grid-cols-1 sm:grid-cols-7 gap-0 sm:gap-8'>
				<article className='col-span-2'>
					<h3 className='text-secondary font-bold text-lg md:text-xl mb-2'>
						Credit Bank Details
					</h3>
					<p className='text-accent-gray font-medium w-full text-sm md:text-base sm:max-w-[230px] leading-[22px]'>
						Provide credit details for this exchange.
					</p>
					<hr className='my-8 sm:hidden' />
				</article>

				<section className='col-span-5'>
					<div className='flex items-center gap-8 mb-8'>
						<div className='form-check flex'>
							<input
								className='form-check-input appearance-none rounded-full h-6 w-6 border border-gray-300 bg-white checked:bg-primary checked:border-primary focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer'
								type='radio'
								name='creditBankDetails'
								id='bankAccount'
								value='bankAccount'
								checked={creditBankDetails === "bankAccount"}
								onChange={() =>
									router.replace({
										query: {
											...router.query,
											creditBankDetails: "bankAccount",
										},
									})
								}
							/>
							<label
								className='form-check-label mt-[5px] cursor-pointer w-[calc(100%-32px)] inline-block text-gray-800'
								htmlFor='bankAccount'>
								<div className='font-medium whitespace-nowrap'>
									Bank Account
								</div>
							</label>
						</div>

						<div className='form-check flex'>
							<input
								className='form-check-input appearance-none rounded-full h-6 w-6 border border-gray-300 bg-white checked:bg-primary checked:border-primary focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer'
								type='radio'
								name='creditBankDetails'
								id='cashAtHand'
								value='cashAtHand'
								disabled
								checked={creditBankDetails === "cashAtHand"}
								onChange={() =>
									router.replace({
										query: {
											...router.query,
											creditBankDetails: "cashAtHand",
										},
									})
								}
							/>
							<label
								className='form-check-label mt-[5px] cursor-pointer w-[calc(100%-32px)] inline-block text-gray-800'
								htmlFor='cashAtHand'>
								<div className='font-medium whitespace-nowrap flex items-center gap-4'>
									Cash at Hand
									<span className='hidden md:block'>
										<StatusPill status='coming soon' />
									</span>
								</div>
							</label>
						</div>
					</div>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='w-full xl:max-w-[70%] space-y-7'>
						{creditBankDetails === "bankAccount" && (
							<>
								{to === "NGN" ? (
									<Input
										label='Type of  account'
										placeholder='Type of  account'
										value='Local Account(Naira)'
										disabled
										required
									/>
								) : to === "EUR" || to === "GBP" ? (
									<Input
										label='Type of  account'
										placeholder='Type of  account'
										value='Euro Account (GBP/EUR)'
										disabled
										required
										readOnly
									/>
								) : (
									<Controller
										name='accountType'
										control={control}
										rules={{
											required: "Account Type is required",
										}}
										render={({ field: { onChange, value } }) => (
											<SelectInput
												onChange={onChange}
												value={value}
												name='to '
												placeholder='Select Account Type'
												options={
													to === "USD"
														? accountTypes?.filter(
																(type) =>
																	type !== "Local Account(Naira)" &&
																	type !== "Euro Account (GBP/EUR)" &&
																	type !== "Local Dom Account (USD) FCMB" &&
																	type !==
																		"Local Dom Account (USD) FIDELITY/UNION"
														  )
														: []
												}
												label='To'
												theme='outline'
												caretColor='#061914'
												required
											/>
										)}
									/>
								)}

								{accountType &&
									accountType !== "Euro Account (GBP/EUR)" &&
									banks?.length > 0 && (
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
													required
													caretColor='#061914'
													disabled={
														accountType === "Local Dom Account (USD) FCMB"
													}
												/>
											)}
										/>
									)}

								{accountType && accountType === "Euro Account (GBP/EUR)" && (
									<Controller
										name='bank'
										control={control}
										rules={{
											required: "Bank is required",
										}}
										render={({ field: { onChange, value } }) => (
											<Input
												onChange={onChange}
												value={value}
												name='bank'
												placeholder='Select Bank'
												label='Bank Name'
												required
												theme='outline'
											/>
										)}
									/>
								)}

								<Controller
									name='accountNumber'
									control={control}
									rules={{
										required: "Account number is required",
										// minLength: {
										// 	value: 10,
										// 	message: "Account number must be 10 digits",
										// },
										// maxLength: {
										// 	value: 10,
										// 	message: "Account number must be 10 digits",
										// },
									}}
									render={({ field: { onChange, value } }) => (
										<Input
											onChange={(e) =>
												onChange(e.target.value.replace(/[^0-9]/g, ""))
											}
											value={value}
											label='Account Number'
											placeholder='Account Number'
											required
											errors={[errors?.accountNumber?.message]}
										/>
									)}
								/>

								{to.toString() === "NGN" && (
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
												required
												errors={[errors?.accountName?.message]}
												disabled={to === "NGN"}
											/>
										)}
									/>
								)}

								{to.toString() !== "NGN" && (
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
													required
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
													required
													errors={[errors?.lastName?.message]}
												/>
											)}
										/>
										<Controller
											name='email'
											control={control}
											rules={{
												required: "Email is required",
												pattern: {
													value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
													message: "Invalid email address",
												},
											}}
											render={({ field: { onChange, value } }) => (
												<Input
													onChange={onChange}
													value={value}
													label='Email'
													type='email'
													placeholder='Email'
													required
													errors={[errors?.email?.message]}
												/>
											)}
										/>
										<Controller
											name='phone'
											control={control}
											rules={{
												required: "Phone number is required",
												pattern: {
													value: /^\+(?:[0-9] ?){6,14}[0-9]$/,
													message:
														"Invalid phone number. Please enter a valid international phone number",
												},
											}}
											render={({ field: { onChange, value } }) => (
												<Input
													onChange={(e) =>
														onChange(e.target.value.replace(/[^0-9+]/g, ""))
													}
													value={value}
													label='Phone Number (International Format)'
													placeholder='Phone Number'
													required
													errors={[errors?.phone?.message]}
												/>
											)}
										/>
										<Controller
											name='address'
											control={control}
											rules={{
												required: "Address is required",
											}}
											render={({ field: { onChange, value } }) => (
												<Input
													onChange={onChange}
													value={value}
													label='Address'
													placeholder='Address'
													required
													errors={[errors?.address?.message]}
												/>
											)}
										/>
									</>
								)}

								{accountType === "Local Dom Account (USD) FIDELITY/UNION" && (
									<Controller
										name='senderCity'
										control={control}
										rules={{
											required: "Sender city is required",
										}}
										render={({ field: { onChange, value } }) => (
											<Input
												onChange={onChange}
												value={value}
												label='Sender City'
												placeholder='Sender City'
												required
												errors={[errors?.senderCity?.message]}
											/>
										)}
									/>
								)}

								{(accountType === "US Account (USD)" ||
									accountType === "Euro Account (GBP/EUR)") && (
									<>
										<Controller
											name='swiftCode'
											control={control}
											rules={{
												required: "Swift code is required",
											}}
											render={({ field: { onChange, value } }) => (
												<Input
													onChange={onChange}
													value={value}
													label='Swift Code'
													placeholder='Swift Code'
													required
													errors={[errors?.swiftCode?.message]}
												/>
											)}
										/>
										<Controller
											name='routingNumber'
											control={control}
											rules={{
												required: "Routing number is required",
											}}
											render={({ field: { onChange, value } }) => (
												<Input
													onChange={onChange}
													value={value}
													label='Routing Number'
													placeholder='Routing Number'
													required
													errors={[errors?.routingNumber?.message]}
												/>
											)}
										/>
									</>
								)}

								{accountType === "Euro Account (GBP/EUR)" && (
									<>
										<Controller
											name='address'
											control={control}
											rules={{
												required: "Address is required",
											}}
											render={({ field: { onChange, value } }) => (
												<Input
													onChange={onChange}
													value={value}
													label='Address'
													placeholder='Address'
													required
													errors={[errors?.address?.message]}
												/>
											)}
										/>
										<Controller
											name='country'
											control={control}
											rules={{
												required: "Country is required",
											}}
											render={({ field: { onChange, value } }) => (
												<Input
													onChange={onChange}
													value={value}
													label='Country'
													placeholder='Country'
													required
													errors={[errors?.country?.message]}
												/>
											)}
										/>
										<Controller
											name='postalCode'
											control={control}
											rules={{
												required: "Postal code is required",
											}}
											render={({ field: { onChange, value } }) => (
												<Input
													onChange={onChange}
													value={value}
													label='Postal Code'
													placeholder='Postal Code'
													required
													errors={[errors?.postalCode?.message]}
												/>
											)}
										/>
										<Controller
											name='city'
											control={control}
											rules={{
												required: "City is required",
											}}
											render={({ field: { onChange, value } }) => (
												<Input
													onChange={onChange}
													value={value}
													label='City'
													placeholder='City'
													required
													errors={[errors?.city?.message]}
												/>
											)}
										/>
										<Controller
											name='streetNumber'
											control={control}
											rules={{
												required: "Street number is required",
											}}
											render={({ field: { onChange, value } }) => (
												<Input
													onChange={onChange}
													value={value}
													label='Street Number'
													placeholder='Street Number'
													required
													errors={[errors?.streetNumber?.message]}
												/>
											)}
										/>
										<Controller
											name='streetName'
											control={control}
											rules={{
												required: "Street name is required",
											}}
											render={({ field: { onChange, value } }) => (
												<Input
													onChange={onChange}
													value={value}
													label='Street Name'
													placeholder='Street Name'
													required
													errors={[errors?.streetName?.message]}
												/>
											)}
										/>
									</>
								)}

								{accountType === "Local Dom Account (USD) FCMB" && (
									<>
										<Controller
											name='phone'
											control={control}
											rules={{
												required: "Phone number is required",
											}}
											render={({ field: { onChange, value } }) => (
												<Input
													onChange={onChange}
													value={value}
													label='Phone Number'
													placeholder='Phone Number'
													required
													errors={[errors?.phone?.message]}
												/>
											)}
										/>
										<Controller
											name='address'
											control={control}
											rules={{
												required: "Address is required",
											}}
											render={({ field: { onChange, value } }) => (
												<Input
													onChange={onChange}
													value={value}
													label='Address'
													placeholder='Address'
													required
													errors={[errors?.address?.message]}
												/>
											)}
										/>
										<Controller
											name='beneficiaryOccupation'
											control={control}
											rules={{
												required: "Beneficiary occupation is required",
											}}
											render={({ field: { onChange, value } }) => (
												<Input
													onChange={onChange}
													value={value}
													label='Beneficiary Occupation'
													placeholder='Beneficiary Occupation'
													required
													errors={[errors?.beneficiaryOccupation?.message]}
												/>
											)}
										/>
										<Controller
											name='senderIDNumber'
											control={control}
											rules={{
												required: "Sender ID number is required",
											}}
											render={({ field: { onChange, value } }) => (
												<Input
													onChange={onChange}
													value={value}
													label='Sender ID Number'
													placeholder='Sender ID Number'
													required
													errors={[errors?.senderIDNumber?.message]}
												/>
											)}
										/>
										<Controller
											name='senderIdType'
											control={control}
											rules={{
												required: "Sender ID type is required",
											}}
											render={({ field: { onChange, value } }) => (
												<Input
													onChange={onChange}
													value={value}
													label='Sender ID Type'
													placeholder='Sender ID Type'
													required
													errors={[errors?.senderIdType?.message]}
												/>
											)}
										/>
										<Controller
											name='senderMobileNumber'
											control={control}
											rules={{
												required: "Sender ID mobile number is required",
											}}
											render={({ field: { onChange, value } }) => (
												<Input
													onChange={onChange}
													value={value}
													label='Sender ID Mobile Number'
													placeholder='Sender ID Mobile Number'
													required
													errors={[errors?.senderMobileNumber?.message]}
												/>
											)}
										/>
										<Controller
											name='senderAddress'
											control={control}
											rules={{
												required: "Sender address is required",
											}}
											render={({ field: { onChange, value } }) => (
												<Input
													onChange={onChange}
													value={value}
													label='Sender Address'
													placeholder='Sender Address'
													required
													errors={[errors?.senderAddress?.message]}
												/>
											)}
										/>
										<Controller
											name='senderIdExpiry'
											control={control}
											// rules={{
											// 	required: "Sender ID expiry is required",
											// }}
											render={({ field: { onChange, value } }) => (
												<Input
													onChange={onChange}
													value={value}
													type='date'
													label='Sender ID Expiry'
													placeholder='Sender ID Expiry'
													// required
													errors={[errors?.senderIdExpiry?.message]}
												/>
											)}
										/>
										<Controller
											name='senderOccupation'
											control={control}
											rules={{
												required: "Sender occupation is required",
											}}
											render={({ field: { onChange, value } }) => (
												<Input
													onChange={onChange}
													value={value}
													label='Sender Occupation'
													placeholder='Sender Occupation'
													required
													errors={[errors?.senderOccupation?.message]}
												/>
											)}
										/>
										<Controller
											name='relationshipToBeneficiary'
											control={control}
											rules={{
												required: "Relationship to beneficiary is required",
											}}
											render={({ field: { onChange, value } }) => (
												<Input
													onChange={onChange}
													value={value}
													label='Relationship To Beneficiary'
													placeholder='Relationship To Beneficiary'
													required
													errors={[errors?.relationshipToBeneficiary?.message]}
												/>
											)}
										/>
									</>
								)}

								{/* <Switch label='Save Bank Account' /> */}

								<Controller
									name='transferPurpose'
									control={control}
									render={({ field: { onChange, value } }) => (
										<Input
											onChange={onChange}
											value={value}
											label='Purpose of this exchange'
											placeholder='Purpose of this exchange'
											optional={true}
											errors={[errors?.transferPurpose?.message]}
										/>
									)}
								/>
							</>
						)}

						{creditBankDetails === "cashAtHand" && (
							<>
								<Input
									label='Purpose of this exchange'
									placeholder='Purpose of this exchange'
									optional={true}
								/>

								<div className='form-check flex'>
									<input
										className='form-check-input appearance-none rounded-full h-6 w-6 border border-gray-300 bg-white checked:bg-primary checked:border-primary focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer'
										type='radio'
										name='store'
										id='Surulere Store'
										value='Surulere Store'
										checked={store === "Surulere Store"}
										onChange={() =>
											router.replace({
												query: {
													...router.query,
													store: "Surulere Store",
												},
											})
										}
									/>
									<label
										className='form-check-label mt-[0.5px] cursor-pointer w-[calc(100%-32px)] inline-block text-gray-800'
										htmlFor='Surulere Store'>
										<article>
											<h4 className='font-bold text-secondary'>
												Surulere Store
											</h4>
											<p className='font-medium text-sm lg:text-base text-accent-gray leading-[22px]'>
												Lorem ipsum dolor sit amet, consectetur adipiscing elit.
												Sem eget id bibendum iaculis tincidunt cum. Consequat id
												sit leo nunc mattis nec. Dolor ut gravida cras amet.
												Ultrices netus enim lorem etiam nisi laoreet ut
												dignissim purus. Ut et sed.
											</p>
										</article>
										<Button
											size='sm'
											className='mt-[5px]'
											icon='green-plus'
											theme='outline'>
											Copy Address
										</Button>
									</label>
								</div>

								<div className='form-check flex'>
									<input
										className='form-check-input appearance-none rounded-full h-6 w-6 border border-gray-300 bg-white checked:bg-primary checked:border-primary focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer'
										type='radio'
										name='store'
										id='ifako ijaye Store'
										value='ifako ijaye Store'
										checked={store === "ifako ijaye Store"}
										onChange={() =>
											router.replace({
												query: {
													...router.query,
													store: "ifako ijaye Store",
												},
											})
										}
									/>
									<label
										className='form-check-label mt-[0.5px] cursor-pointer w-[calc(100%-32px)] inline-block text-gray-800'
										htmlFor='ifako ijaye Store'>
										<article>
											<h4 className='font-bold text-secondary'>
												Ifako ijaye Store
											</h4>
											<p className='font-medium text-sm lg:text-base text-accent-gray leading-[22px]'>
												Lorem ipsum dolor sit amet, consectetur adipiscing elit.
												Sem eget id bibendum iaculis tincidunt cum. Consequat id
												sit leo nunc mattis nec. Dolor ut gravida cras amet.
												Ultrices netus enim lorem etiam nisi laoreet ut
												dignissim purus. Ut et sed.
											</p>
										</article>
										<Button
											size='sm'
											className='mt-[5px]'
											icon='green-plus'
											theme='outline'>
											Copy Address
										</Button>
									</label>
								</div>
							</>
						)}

						<div className='flex flex-col md:flex-row items-center pt-2'>
							<Button
								type='submit'
								loading={isLoadingPayment}
								disabled={!isValid}
								size='sm'
								className='w-full'>
								Convert
							</Button>
							<Button
								size='sm'
								theme='plain'
								className='w-full text-primary'
								onClick={() =>
									router.push({
										pathname: router.pathname,
										query: { ...router.query, step: "1" },
									})
								}>
								Previous Step
							</Button>
						</div>
					</form>
				</section>
			</div>
		</WhiteWrapper>
	);
};

export default CreditDetails;
