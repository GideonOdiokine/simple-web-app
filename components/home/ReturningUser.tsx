import DefaultLayout from "@/layouts/DefaultLayout";
import TransactionsReview from "./TransactionsReview";
import ExchangeRate from "./ExchangeRate";
import TransactionHistory from "./TransactionHistory";

const ReturningUser = ({ rates, transactions, transactionsCount }: any) => {
	return (
		<DefaultLayout title='Get started with Kadavra'>
			<TransactionsReview transactionsCount={transactionsCount} />
			<section className='grid grid-cols-1 xl:grid-cols-5 mt-16 gap-y-8 xl:gap-8'>
				<ExchangeRate rates={rates} />
				<TransactionHistory transactions={transactions} />
			</section>
		</DefaultLayout>
	);
};

export default ReturningUser;
