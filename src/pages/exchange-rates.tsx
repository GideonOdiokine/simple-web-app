import ExchangeRate from "@/components/home/ExchangeRate";
import { requireAuthentication } from "@/hoc/requireAuthentication";
import DefaultLayout from "@/layouts/DefaultLayout";
import { GetServerSideProps, NextPage } from "next";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { wrapper } from "src/app/store";
import {
	getExchangeRate,
	getRunningOperationPromises,
} from "src/services/transactions";

const ExchangeRatePage: NextPage = ({ rawRates }: any) => {
	const [rates, setRates] = useState<any>(null);

	useEffect(() => {
		const parsedRates = Object.entries(rawRates).map((rate) => {
			const [currency, exchangeRate] = rate;
			return { currency, exchangeRate };
		});
		setRates(parsedRates);
	}, []);

	return (
		<DefaultLayout title='All Exchange Rates (CBN)' goBack>
			<ExchangeRate
				showSearch
				showHeader={false}
				showAllCurrencies
				rates={rates}
			/>
		</DefaultLayout>
	);
};

export default ExchangeRatePage;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
	wrapper.getServerSideProps((store) => async (context) => {
		store.dispatch(
			getExchangeRate.initiate({
				baseCurrency: "USD",
				targetCurrency: "",
			})
		);

		try {
			const response = await Promise.all(getRunningOperationPromises());
			return {
				props: {
					rawRates: response[0]["data"].rates,
				},
			};
		} catch (error) {
			console.log(error);
			toast.error(error?.data?.responseDescription);
			return {
				props: {
					rawRates: [],
				},
			};
		}
	})
);
