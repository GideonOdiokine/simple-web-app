import type { GetServerSideProps, NextPage } from "next";
import { requireAuthentication } from "@/hoc/requireAuthentication";
import NewUser from "@/components/home/NewUser";
import ReturningUser from "@/components/home/ReturningUser";
import {
	getExchangeRate,
	getRunningOperationPromises,
	getTransactions,
	getTransactionsCount,
} from "src/services/transactions";
import { toast } from "react-toastify";
import { wrapper } from "src/app/store";
import { useEffect, useState } from "react";
import { Transaction } from "./transaction-overview";

type Props = {
	transactions: Transaction;
	rawRates: any;
	transactionsCount: {
		data: {
			totalCompleted: number;
			totalFailed: number;
			totalPending: number;
		};
	};
};

const IndexPage: NextPage = ({
	rawRates,
	transactions,
	transactionsCount,
}: Props) => {
	const [rates, setRates] = useState<any>(null);

	useEffect(() => {
		const parsedRates = Object.entries(rawRates).map((rate) => {
			const [currency, exchangeRate] = rate;
			return { currency, exchangeRate };
		});
		setRates(parsedRates);
	}, []);

	if (!Object.values(transactionsCount?.data)?.some((val) => val > 0)) {
		return <NewUser />;
	}

	return (
		<ReturningUser
			rates={rates}
			transactions={transactions}
			transactionsCount={transactionsCount}
		/>
	);
};

export default IndexPage;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
	wrapper.getServerSideProps((store) => async (context) => {
		const token = context.req.cookies.kadavraToken;

		store.dispatch(
			getExchangeRate.initiate({
				baseCurrency: "USD",
				targetCurrency: "",
			})
		);

		store.dispatch(
			getTransactions.initiate({
				token,
				pageSize: 4,
			})
		);

		store.dispatch(
			getTransactionsCount.initiate({
				token,
			})
		);

		try {
			const response = await Promise.all(getRunningOperationPromises());
			return {
				props: {
					rawRates: response[0]["data"].rates,
					transactions: response[1]["data"] || [],
					transactionsCount: response[2]["data"] || [],
				},
			};
		} catch (error) {
			console.log(error);
			toast.error(error?.data?.responseDescription);
			return {
				props: {
					rawRates: [],
					transactions: [],
					transactionsCount: [],
				},
			};
		}
	})
);
