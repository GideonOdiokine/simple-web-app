import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
	useConvertCurrencyMutation,
	useGetCurrenciesMutation,
} from "src/services/transactions";
import Button from "../global/Button";
import Input from "../global/Input";
import SelectInput from "../global/SelectInput";
import WhiteWrapper from "../global/WhiteWrapper";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import debounce from "debounce";
import { numberWithCommas } from "@/helpers/numberWithCommas";

type Currencies = {
	createdAt: string;
	id: number;
	name: string;
	status: boolean;
	symbol: string;
};

type ConvertedCurrency = {
	rate: number;
	timestamp: number;
	value: string;
};

const EnterAmount = () => {
	const [currencies, setCurrencies] = useState<Currencies[]>();
	const [convertedCurrency, setConvertedCurrency] =
		useState<ConvertedCurrency>();

	const router = useRouter();

	const {
		formState: { errors, isValid },
		getValues,
		watch,
		control,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			amount: 0,
			from: null,
			to: null,
		},
	});

	const _from = watch("from");

	const _to = watch("to");

	const amount = watch("amount");

	const token = Cookies.get("kadavraToken");

	const [getCurrencies, { isLoading }] = useGetCurrenciesMutation();

	useEffect(() => {
		async function _getCurrencies() {
			try {
				const response = (await getCurrencies({
					token,
				}).unwrap()) as any;
				setCurrencies(response.data);
			} catch (err) {
				toast.error(err?.data?.responseDescription);
			}
		}
		_getCurrencies();
	}, []);

	const [convert, { isLoading: isLoadingConvert }] =
		useConvertCurrencyMutation();

	useEffect(() => {
		setConvertedCurrency(null);
		const convertCurrency = debounce(async () => {
			if (
				_from?.value &&
				_to?.value &&
				Number(amount.toString().replace(/,/g, "") + "00") > 0
			) {
				try {
					const response = (await convert({
						token,
						body: {
							fromCurrency: _from?.value,
							toCurrency: _to?.value,
							amount: Number(amount.toString().replace(/,/g, "") + "00") || 0,
						},
					}).unwrap()) as any;
					setConvertedCurrency(response.data);
				} catch (err) {
					toast.error(err?.data?.responseDescription);
				}
			}
		}, 500);
		convertCurrency();
	}, [_from, _to, amount]);

	return (
		<WhiteWrapper isLoading={isLoading || isLoadingConvert}>
			<div className='grid grid-cols-1 sm:grid-cols-7 gap-0 sm:gap-8'>
				<article className='col-span-2'>
					<h3 className='text-secondary font-bold text-lg md:text-xl mb-2'>
						Amount
					</h3>
					<p className='text-accent-gray font-medium w-full text-sm md:text-base sm:max-w-[230px] leading-[22px]'>
						Enter the amount and appropriate currencies needed for the
						conversion so you can see the rates and the amount you will get.
					</p>
					<Button tag='a' href='/exchange-rates' className='text-sm'>
						View exchange rate
					</Button>
					<hr className='my-8 sm:hidden' />
				</article>
				<section className='col-span-5'>
					<form className='w-full xl:max-w-[70%] space-y-7'>
						<Controller
							name='amount'
							control={control}
							rules={{
								required: "Amount is required",
							}}
							render={({ field: { onChange, value } }) => (
								<Input
									onChange={(e) =>
										onChange(
											numberWithCommas(e.target.value.replace(/[^0-9.+]/g, ""))
										)
									}
									value={value}
									label='I want to convert'
									placeholder='I want to convert'
									errors={[errors?.amount?.message]}
									required
								/>
							)}
						/>

						<section className='space-y-4'>
							<div className='flex flex-col lg:flex-row items-center justify-between gap-0 lg:gap-3'>
								<Controller
									name='from'
									control={control}
									rules={{
										required: "From is required",
									}}
									render={({ field: { onChange, value } }) => (
										<SelectInput
											onChange={onChange}
											value={value}
											name='from'
											searchable
											placeholder='Select currency'
											options={currencies
												?.filter(
													(currency) =>
														currency.symbol !== getValues("to")?.value
												)
												?.map((currency) => {
													return {
														label: currency.name,
														value: currency.symbol,
													};
												})}
											label='From'
											theme='outline'
											caretColor='#061914'
											icon
											required
										/>
									)}
								/>
								<svg
									className='w-12 h-12 mt-8'
									width='32'
									height='44'
									viewBox='0 0 32 44'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'>
									<path
										d='M22.57 20.1C22.3998 20.1811 22.256 20.3086 22.1552 20.4678C22.0543 20.627 22.0005 20.8115 22 21V24H14C13.7348 24 13.4804 24.1054 13.2929 24.2929C13.1054 24.4804 13 24.7348 13 25V27C13 27.2652 13.1054 27.5196 13.2929 27.7071C13.4804 27.8947 13.7348 28 14 28H22V31C22.0002 31.1922 22.0559 31.3802 22.1602 31.5416C22.2645 31.703 22.4131 31.8309 22.5883 31.9101C22.7634 31.9892 22.9576 32.0162 23.1477 31.9878C23.3378 31.9594 23.5156 31.8769 23.66 31.75L29.66 26.52C29.7667 26.4263 29.8522 26.311 29.9108 26.1816C29.9694 26.0523 29.9998 25.912 30 25.77C29.9964 25.6232 29.9604 25.479 29.8947 25.3476C29.8291 25.2163 29.7353 25.101 29.62 25.01L23.62 20.24C23.4757 20.1207 23.3007 20.0443 23.1151 20.0196C22.9294 19.9948 22.7406 20.0227 22.57 20.1ZM9.43 23.9C9.60017 23.819 9.74397 23.6915 9.84482 23.5322C9.94567 23.373 9.99947 23.1885 10 23V20H18C18.2652 20 18.5196 19.8947 18.7071 19.7071C18.8946 19.5196 19 19.2652 19 19V17C19 16.7348 18.8946 16.4804 18.7071 16.2929C18.5196 16.1054 18.2652 16 18 16H10V13C9.99976 12.8078 9.94414 12.6198 9.83982 12.4584C9.73549 12.297 9.58687 12.1691 9.41173 12.09C9.2366 12.0109 9.04238 11.9839 8.85231 12.0122C8.66224 12.0406 8.48438 12.1232 8.34 12.25L2.34 17.48C2.23333 17.5737 2.14784 17.6891 2.08922 17.8184C2.03059 17.9477 2.00018 18.088 2 18.23C2.00365 18.3768 2.03959 18.521 2.10526 18.6524C2.17094 18.7837 2.26474 18.899 2.38 18.99L8.38 23.76C8.52435 23.8793 8.6993 23.9557 8.88494 23.9805C9.07058 24.0052 9.25943 23.9773 9.43 23.9Z'
										fill='#0EA579'
									/>
								</svg>
								<Controller
									name='to'
									control={control}
									rules={{
										required: "To is required",
									}}
									render={({ field: { onChange, value } }) => (
										<SelectInput
											onChange={onChange}
											value={value}
											name='to'
											searchable
											placeholder='Select currency'
											options={currencies
												?.filter(
													(currency) =>
														currency.symbol !== getValues("from")?.value
												)
												?.map((currency) => {
													return {
														label: currency.name,
														value: currency.symbol,
													};
												})}
											label='To'
											theme='outline'
											caretColor='#061914'
											icon
											required
										/>
									)}
								/>
							</div>

							{convertedCurrency && (
								<>
									<div className='p-3 lg:px-6 space-x-[2px] space-y-2 text-sm lg:text-base bg-[#0EA5791A] rounded-[5px]'>
										<div className='flex items-center justify-between'>
											<div className='text-accent-gray font-medium'>
												1 {_from?.label} ={" "}
												<span className='text-secondary'>
													{Number(
														(convertedCurrency?.value as any) /
															Number(amount.toString().replace(/,/g, ""))
													).toLocaleString("en-US", {
														minimumFractionDigits: 5,
													})}
													<span className='ml-1'>{_to?.label}</span>
												</span>
											</div>
											<Button
												tag='a'
												href={`${process.env.NEXT_PUBLIC_DOMAIN_WEBSITE_URL}`}
												target='_blank'
												className='hidden md:flex text-sm text-[#396AE3]'>
												Learn more
											</Button>
										</div>
										<div className='text-accent-gray font-medium'>
											1 {_to?.label} ={" "}
											<span className='text-secondary'>
												{Number(convertedCurrency?.rate).toLocaleString(
													"en-US"
												)}{" "}
												{_from?.label}
											</span>
										</div>
										<div className='md:hidden'>
											<Button tag='a' className='text-sm text-[#396AE3]'>
												Learn more
											</Button>
										</div>
										{/* <div className='text-primary text-sm font-medium'>
											Kadavra fee deducted{" "}
											<span className='text-base text-secondary'>(3 USD)</span>
										</div> */}
									</div>

									<div className=' text-secondary'>
										<div className='text-sm md:text-base flex items-center gap-3 lg:text-xl font-medium'>
											{amount}
											<div
												className={`currency-flag currency-flag-${_from?.value?.toLowerCase()}`}
											/>{" "}
											{_from?.label} =
										</div>
										<div className='text-base md:text-2xl flex items-center gap-3 lg:text-3xl font-bold'>
											{Number(convertedCurrency?.value).toLocaleString("en-US")}
											<div
												className={`currency-flag currency-flag-${_to?.value?.toLowerCase()}`}
											/>{" "}
											{_to?.label}
										</div>
									</div>

									<hr />
								</>
							)}

							<div className='flex flex-col md:flex-row items-center pt-2'>
								<Button
									size='sm'
									disabled={
										!_to?.value ||
										!_from?.value ||
										!(Number(amount.toString().replace(/,/g, "") + "00") > 0) ||
										!convertedCurrency
									}
									className='w-full'
									onClick={() =>
										router.push({
											pathname: router.pathname,
											query: {
												...router.query,
												step: "2",
												creditBankDetails: "bankAccount",
												from: _from?.value,
												to: _to?.value,
												amount:
													Number(amount.toString().replace(/,/g, "") + "00") ||
													0,
											},
										})
									}>
									Continue
								</Button>
								<Button
									size='sm'
									theme='plain'
									className='w-full text-primary'
									onClick={() =>
										router.push({
											pathname: router.pathname,
											query: { ...router.query, step: undefined },
										})
									}>
									Back
								</Button>
							</div>
						</section>
					</form>
				</section>
			</div>
		</WhiteWrapper>
	);
};

export default EnterAmount;
