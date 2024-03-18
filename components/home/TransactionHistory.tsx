import React from "react";
import { Transaction } from "src/pages/transaction-overview";
import Button from "../global/Button";
import Empty from "../global/Empty";
import StatusPill from "../global/StatusPill";

type Props = {
	transactions: Transaction;
};

const TransactionHistory = ({ transactions }: Props) => {
	return (
		<div className='col-span-3 h-full'>
			<h2 className='text-secondary font-bold text-xl md:text-2xl mb-5'>
				Transaction History
			</h2>

			{transactions.data?.length > 0 && (
				<div className='w-full overflow-auto'>
					<table className='w-full'>
						<thead className='bg-white rounded-[5px] text-[#5A5C5C] font-bold'>
							<tr>
								<th className='p-8 h-[116px] text-left rounded-tl-[5px]'>
									Recipient/Date
								</th>
								<th className='p-8 h-[116px] text-left'>From -{">"} To</th>
								<th className='p-8 h-[116px] text-left rounded-tr-[5px]'>
									Payment/Disbursement Status
								</th>
							</tr>
						</thead>
						<tbody className='text-secondary font-medium text-sm'>
							{transactions?.data?.map((item) => {
								const {
									paymentStatus,
									paymentDate,
									disbursementDate,
									disbursementStatus,
									baseCurrency,
									baseAmount,
									targetCurrency,
									targetAmount,
									id,
									recipientDetails,
									createdAt,
								} = item;

								const formatter = new Intl.DateTimeFormat("en", {
									year: "numeric",
									month: "numeric",
									day: "2-digit",
									hour: "2-digit",
									minute: "2-digit",
								});
								const date = formatter.format(new Date(createdAt));

								const base =
									Number(
										baseAmount
											.toString()
											.substr(0, baseAmount.toString().length - 2)
									).toLocaleString("en-US") +
									"." +
									baseAmount.toString().substr(-2);

								const target =
									Number(
										targetAmount
											.toString()
											.substr(0, targetAmount.toString().length - 2)
									).toLocaleString("en-US") +
									"." +
									targetAmount.toString().substr(-2);

								return (
									<tr key={id} className='even:bg-white odd:bg-[#5A5C5C0D]'>
										<td className='px-6 py-3 w-[33.3%]'>
											<div className='mb-4'>
												{recipientDetails.beneficiaryName ||
													recipientDetails.accountName ||
													`${recipientDetails.firstName || "N/A"} ${
														recipientDetails.lastName || ""
													}`}
											</div>
											<div className='text-[#5A5C5C]'>{date}</div>
										</td>
										<td className='px-6 py-3 w-[33.3%]'>
											<div className=''>
												{base} {""}
												{baseCurrency}
											</div>
											<div className=''> -{">"} </div>
											<div className='text-[#5A5C5C]'>
												{target} {targetCurrency}
											</div>
										</td>
										<td className='px-6 py-3 w-[33.3%]'>
											<div className='mb-4'>
												<StatusPill status={paymentStatus || ""} />
												<div>
													{paymentStatus === "SUCCESS" &&
														formatter.format(new Date(paymentDate))}
												</div>
											</div>
											<div>
												<StatusPill status={disbursementStatus || "Unknown"} />
												<div className='text-[#5A5C5C]'>
													{disbursementStatus === "SUCCESS" &&
														formatter.format(new Date(disbursementDate))}
												</div>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}
			{(transactions?.data?.length === 0 || !transactions.data) && (
				<Empty
					title='You currently have no transactions'
					text='Your transactions will appear here once you perform a transaction.'
					type='transactions'
				/>
			)}
			{transactions?.data?.length > 0 && (
				<div className='bg-white flex justify-center rounded-[5px] px-8 py-6 text-[#5A5C5C] font-bold'>
					<Button
						tag='a'
						href='/transaction-overview'
						className='text-sm font-normal'>
						View more transaction history
					</Button>
				</div>
			)}
		</div>
	);
};

export default TransactionHistory;
