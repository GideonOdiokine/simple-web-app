import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useGetExchangeRateMutation } from "src/services/transactions";
import Button from "../global/Button";
import SelectInput from "../global/SelectInput";
import "currency-flags/dist/currency-flags.css";
import ProgressBar from "../global/ProgressBar/ProgressBar";
import Input from "../global/Input";
import { useUpdateEffect } from "react-use";

export type RateProps = {
	currency: string;
	exchangeRate: string;
};

const ExchangeRate = ({
	rates: ssrRates,
	selectedRates,
	showAllCurrencies = false,
	showSearch = false,
	showHeader = true,
}: any) => {
	const [rates, setRates] = useState<any>(null);

	const { control, watch } = useForm({
		mode: "onChange",
		defaultValues: {
			currency: "USD",
			search: "",
		},
	});

	const currency = watch("currency");

	const search = watch("search");

	const exchangRate = async () => {
		try {
			const response = await getExchangeRate({
				baseCurrency: currency,
				targetCurrency: "",
			}).unwrap();
			const parsedRates = Object.entries(response.rates).map((rate) => {
				const [currency, exchangeRate] = rate;
				return { currency, exchangeRate };
			});
			setRates(parsedRates);
		} catch (err) {
			toast.error(err?.data?.responseDescription);
		}
	};

	useUpdateEffect(() => {
		setRates(ssrRates);
	}, [ssrRates]);

	useUpdateEffect(() => {
		exchangRate();
	}, [currency]);

	const [getExchangeRate, { isLoading }] = useGetExchangeRateMutation();

	return (
		<div className='col-span-2 h-full'>
			{showHeader && (
				<div className='mb-5 space-y-2'>
					<h2 className='text-secondary font-bold text-xl md:text-2xl'>
						Exchange Rates
					</h2>
					<p className='text-sm p-3 text-accent-gray border-l-4 border-primary bg-[#1EB53A1A]'>
						<span className='font-bold'>N.B:</span> The below exchange rate is
						the CBN exchange rate and not the conversion rate. The converstion
						rate would be displayed at the point of currency exchange.
					</p>
				</div>
			)}

			<div>
				<div className='bg-[#0EA57933] relative rounded-t-[5px] py-4 px-5 xl:p-8 flex flex-col md:flex-row gap-3 items-center justify-between'>
					{isLoading && (
						<div className='absolute rounded-t-[5px] overflow-hidden top-0 left-0 right-0'>
							<ProgressBar value={0.7} indeterminate={true} />
						</div>
					)}
					<div className='w-[100%] lg:w-[200px] text-sm xl:text-base'>
						<Controller
							name='currency'
							control={control}
							rules={{
								required: "currency is required",
							}}
							render={({ field: { onChange, value } }) => (
								<SelectInput
									onChange={onChange}
									value={value}
									name='Currency'
									searchable
									theme='plain'
									caretColor='#061A14'
									placeholder='Select Currency'
									options={selectedRates}
								/>
							)}
						/>
					</div>
					{showSearch && (
						<div className='w-full md:w-auto flex items-center justify-end text-sm xl:text-base gap-1'>
							{/* Sort By:{" "}
						<div className='w-[60%] lg:w-[190px]'>
							<SelectInput
								name='Sort By'
								theme='plain'
								caretColor='#061A14'
								value='Amount'
								options={["Amount", "Date", "Size"]}
							/>
						</div> */}
							<Controller
								name='search'
								control={control}
								render={({ field: { onChange, value } }) => (
									<Input
										onChange={onChange}
										value={value}
										name='Currency'
										placeholder='Search Currency'
										type='search'
									/>
								)}
							/>
						</div>
					)}
				</div>
				<div className='bg-white pb-5 rounded-b-[5px]'>
					<div>
						{rates
							?.filter((rate: RateProps) =>
								showAllCurrencies && rate.currency !== currency
									? true
									: selectedRates.includes(rate.currency) &&
									  rate.currency !== currency
							)
							.filter((rate: RateProps) =>
								rate.currency.toLowerCase().includes(search.toLowerCase())
							)
							?.map(
								(
									{ currency: _currency, exchangeRate }: RateProps,
									index: React.Key
								) => (
									<div
										className='flex items-center justify-between py-4 px-8 border-b border-primary'
										key={index}>
										<div className='flex items-center gap-2 font-medium text-sm text-secondary'>
											<span
												className={`currency-flag currency-flag-${_currency.toLowerCase()}`}
											/>
											{_currency}
										</div>
										<div className='text-base font-medium text-secondary'>
											{exchangeRate}
										</div>
									</div>
								)
							)}
					</div>
					{!showAllCurrencies && (
						<div className='flex justify-center mt-5'>
							<Button tag='a' href='/exchange-rates' className='text-sm'>
								View more exchange rate
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ExchangeRate;

ExchangeRate.defaultProps = {
	selectedRates: [
		"NGN",
		"USD",
		"GBP",
		"EUR",
		"CAD",
		"CNY",
		"JPY",
		"GHS",
		"RUB",
		"ZAR",
	].sort(),
};
