import Empty from "@/components/global/Empty";
import WhiteWrapper from "@/components/global/WhiteWrapper";
import { requireAuthentication } from "@/hoc/requireAuthentication";
import DefaultLayout from "@/layouts/DefaultLayout";
import { GetServerSideProps } from "next";
import { wrapper } from "src/app/store";
import {
	getRunningOperationPromises,
	getUserDebitBanks,
} from "src/services/transactions";

type BankData = {
	id: number;
	userId: number;
	accountNumber: string;
	accountName?: string;
	bankCode: string;
	bankName: string;
};

type BankDetailsPageProps = {
	data: BankData[];
};

const BankDetailsPage = ({ data }: BankDetailsPageProps) => {
	return (
		<DefaultLayout title='Bank Details'>
			<section className='grid grid-cols-1 md:grid-cols-2 gap-8'>
				{data?.map((bank) => {
					return (
						<WhiteWrapper key={bank.id}>
							<div className='flex flex-col md:flex-row items-start md:items-center gap-3 text-secondary font-bold'>
								{bank.accountName && <div>{bank.accountName}</div>}
								<div className='font-bold bg-[#5A5C5C1A] py-2 px-4 w-fit rounded-[10px] text-accent-gray flex items-center gap-2'>
									<div className={`currency-flag currency-flag-ngn`} />
									Local Account (Naira)
								</div>
							</div>
							<hr className='my-3' />
							<div className='space-y-2'>
								<div className='flex items-center justify-between'>
									<div className='font-medium text-secondary text-sm'>
										Bank Name
									</div>
									<div className='text-sm text-accent-gray'>
										{bank.bankName}
									</div>
								</div>
								<div className='flex items-center justify-between'>
									<div className='font-medium text-secondary text-sm'>
										Account Number
									</div>
									<div className='text-sm text-accent-gray'>
										{bank.accountNumber}
									</div>
								</div>
							</div>
						</WhiteWrapper>
					);
				})}
			</section>
			{(data.length === 0 || !data) && (
				<Empty
					type='transactions'
					title='No bank details found'
					text='there weren’t any saved results found, when you perform a transaction using direct debit, it will be saved here'
				/>
			)}
		</DefaultLayout>
	);
};

export default BankDetailsPage;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
	wrapper.getServerSideProps((store) => async (context) => {
		const token = context.req.cookies.kadavraToken;

		store.dispatch(
			getUserDebitBanks.initiate({
				token,
			})
		);

		try {
			const response = await Promise.all(getRunningOperationPromises());
			return {
				props: {
					data: response[0]["data"]["data"] || [],
				},
			};
		} catch (error) {
			console.log(error);
			return {
				props: {
					data: [],
				},
			};
		}
	})
);
