import Empty from "@/components/global/Empty";
import Input from "@/components/global/Input";
import Pagination from "@/components/global/Pagination";
import ProgressBar from "@/components/global/ProgressBar/ProgressBar";
import SelectInput from "@/components/global/SelectInput";
import StatusPill from "@/components/global/StatusPill";
import Modal from "@/components/Modal/Modal";
import { requireAuthentication } from "@/hoc/requireAuthentication";
import DefaultLayout from "@/layouts/DefaultLayout";
import moment from "moment";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { wrapper } from "src/app/store";
import {
	getRunningOperationPromises,
	getTransactions,
} from "src/services/transactions";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Button from "@/components/global/Button";
import { toast } from "react-toastify";
import debounce from "debounce";

export type Transaction = {
	responseCode: string;
	totalCount: number;
	pageSize: number;
	pageNumber: number;
	data: {
		id: number;
		transactionReference: string;
		firstName: string;
		lastName: string;
		email: string;
		baseCurrency: string;
		baseAmount: number;
		targetCurrency: string;
		targetAmount: number;
		transactionFee: number;
		recipientDetails: {
			accountName: string;
			firstName: string;
			lastName: string;
			accountType: string;
			beneficiaryName: string;
		};
		paymentReference: string;
		paymentStatus: "SUCCESS" | "PENDING" | "FAILED";
		isPaymentDisbursed: boolean;
		disbursementComments: string;
		disbursementStatus: "SUCCESS";
		paymentDate: string;
		disbursementDate: string;
		createdAt: string;
		updatedAt: string;
	}[];
};

type TransactionPageProps = {
	transactions: Transaction;
};

const TransactionPage = ({ transactions }: TransactionPageProps) => {
	const [showModal, setShowModal] = useState(false);
	const [transaction, setTransaction] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isDownloadingReceipt, setIsDownloadingReceipt] = useState(false);
	const router = useRouter();

	const {
		formState: { errors, isValid },
		watch,
		setValue,
		control,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			date: "",
			status: router.query.status || "All",
			search: router.query.search || "",
			pageSize: "10",
		},
	});

	const date = watch("date");

	const status = watch("status");

	const search = watch("search");

	const pageSize = watch("pageSize");

	const filterStatus = async () => {
		try {
			setIsLoading(true);
			await router.replace({
				query: {
					...router.query,
					status: status,
					startDate: undefined,
					endDate: undefined,
					page: 1,
				},
			});
		} catch (error) {
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		setValue("date", "");
		filterStatus();
	}, [status]);

	const filterSearch = debounce(async () => {
		try {
			setIsLoading(true);
			await router.replace({
				query: {
					...router.query,
					search,
					startDate: undefined,
					endDate: undefined,
					page: 1,
				},
			});
		} catch (error) {
		} finally {
			setIsLoading(false);
		}
	}, 500);

	useEffect(() => {
		setValue("date", "");
		filterSearch();
	}, [search]);

	const filterPageSize = async () => {
		try {
			setIsLoading(true);
			await router.replace({
				query: {
					...router.query,
					startDate: undefined,
					endDate: undefined,
					page: 1,
					pageSize,
				},
			});
		} catch (error) {
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		setValue("date", "");
		filterPageSize();
	}, [pageSize]);

	const filterDate = async () => {
		try {
			setIsLoading(true);
			await router.replace({
				query: {
					...router.query,
					page: 1,
					startDate: moment(date.split(" - ")[0].trim()).format("YYYY-MM-DD"),
					endDate:
						date.split(" - ")[1].trim() === date.split(" - ")[0].trim()
							? ""
							: moment(date.split(" - ")[1].trim()).format("YYYY-MM-DD"),
				},
			});
		} catch (error) {
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		filterDate();
	}, [date]);

	const formatter = new Intl.DateTimeFormat("en", {
		year: "numeric",
		month: "numeric",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});

	const downloadPdfDocument = async () => {
		try {
			setIsDownloadingReceipt(true);
			const input = document.getElementById("testId");
			const canvas = await html2canvas(input);
			const imgData = canvas.toDataURL("image/png");
			const pdf = new jsPDF("p", "px", "a4", true);
			pdf.addImage(imgData, "JPEG", 0, 0, 447, 600);
			pdf.save(
				`Kadavra Receipt - ${transaction?.firstName} ${
					transaction?.lastName
				} to ${
					transaction?.recipientDetails?.beneficiaryName ||
					transaction?.recipientDetails?.accountName ||
					`${transaction?.recipientDetails?.firstName || ""} ${
						transaction?.recipientDetails?.lastName || ""
					}`
				}  - ${transaction?.transactionReference || ""}.pdf`
			);
			toast.success("Receipt downloaded successfully");
		} catch (error) {
			console.log(error);
		} finally {
			setIsDownloadingReceipt(false);
		}
	};

	return (
		<DefaultLayout title='Transaction Overview'>
			<div className='mb-6 flex flex-col md:flex-row gap-4 items-baseline justify-between'>
				<div className='w-full md:w-[300px]'>
					<Controller
						name='date'
						control={control}
						render={({ field: { onChange, value } }) => (
							<Input
								onChange={onChange}
								type='date-range'
								value={value}
								label='Date Range'
								placeholder='Start Date - End Date'
								errors={[errors?.date?.message]}
							/>
						)}
					/>
				</div>
				<div className='w-full flex-1 md:w-[300px]'>
					<Controller
						name='search'
						control={control}
						render={({ field: { onChange, value } }) => (
							<Input
								onChange={onChange}
								value={value}
								label='Search'
								placeholder='Search by Transaction Reference, Name, Phone, Currency, Bank Name, Account Number, etc...'
								errors={[errors?.search?.message]}
							/>
						)}
					/>
				</div>
				<div className='w-full md:w-[300px]'>
					<Controller
						name='status'
						control={control}
						render={({ field: { onChange, value } }) => (
							<SelectInput
								onChange={onChange}
								value={value}
								label='Status'
								placeholder='Select Status'
								errors={[errors?.status?.message]}
								name='status'
								theme='outline'
								options={["All", "Success", "Pending", "Failed"]}
								caretColor='#061914'
							/>
						)}
					/>
				</div>
			</div>
			<div className='w-full relative overflow-auto'>
				{isLoading && (
					<div className='absolute rounded-t-[5px] overflow-hidden top-0 left-0 right-0'>
						<ProgressBar value={0.7} indeterminate={true} />
					</div>
				)}
				<table className='w-full'>
					<thead className='bg-white rounded-[5px] text-[#5A5C5C] font-bold'>
						<tr>
							<th className='p-8 h-[116px] text-left rounded-tl-[5px]'>
								Recipient
							</th>
							<th className='p-8 h-[116px] text-left'>From</th>
							<th className='p-8 h-[116px] text-left'>To</th>
							<th className='p-8 h-[116px] text-left'>
								Date <br />
								/Trx Reference
							</th>
							<th className='p-8 h-[116px] text-left rounded-tr-[5px]'>
								Payment Status
								<br />
								/Payment Reference
							</th>
							<th className='p-8 h-[116px] text-left rounded-tr-[5px]'>
								Disbursement Status
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
								paymentReference,
								transactionReference,
								transactionFee,
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

							const _transactionFee =
								Number(
									transactionFee
										.toString()
										.substr(0, transactionFee.toString().length - 2)
								).toLocaleString("en-US") +
								"." +
								transactionFee.toString().substr(-2);

							return (
								<tr
									onClick={() => {
										setTransaction({
											...item,
											base,
											target,
											date,
											_transactionFee,
										});
										setShowModal(true);
									}}
									key={id}
									className='even:bg-white odd:bg-[#5A5C5C0D]'>
									<td className='px-6 py-3 w-[15%] text-[#5A5C5C]'>
										{recipientDetails.beneficiaryName ||
											recipientDetails.accountName ||
											`${recipientDetails.firstName || "N/A"} ${
												recipientDetails.lastName || ""
											}`}
									</td>
									<td className='px-6 py-3 w-[15%] text-[#5A5C5C]'>
										{base} {baseCurrency}
									</td>
									<td className='px-6 py-3 w-[15%] text-[#5A5C5C]'>
										{target} {targetCurrency}
									</td>
									<td className='px-6 py-3 w-[17%] text-[#5A5C5C]'>
										{date}
										<div className='text-sm'>
											{transactionReference ? "/ " + transactionReference : ""}
										</div>
									</td>
									<td className='px-6 py-3 w-[16%] text-[#5A5C5C] space-y-2'>
										<StatusPill status={paymentStatus || ""} />
										<div>
											{paymentStatus === "SUCCESS" &&
												formatter.format(new Date(paymentDate))}
										</div>
										<div className='text-sm'>
											{paymentReference ? "/ " + paymentReference : ""}
										</div>
									</td>
									<td className='px-6 py-3 w-[16%] text-[#5A5C5C] space-y-2'>
										<StatusPill status={disbursementStatus || "Unknown"} />
										<div>
											{disbursementStatus === "SUCCESS" &&
												formatter.format(new Date(disbursementDate))}
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			{transactions?.data?.length === 0 && (
				<Empty
					title='You currently have no transactions'
					text='Your transactions will appear here once you perform a transaction or your search query matches a transaction'
					type='transactions'
				/>
			)}
			<br />
			<div className='w-full mt-4 md:w-[250px]'>
				<Controller
					name='pageSize'
					control={control}
					render={({ field: { onChange, value } }) => (
						<SelectInput
							onChange={onChange}
							value={value}
							label='No. of rows per page'
							placeholder='Select Page Size'
							errors={[errors?.pageSize?.message]}
							name='pageSize'
							option='10'
							position='top'
							theme='outline'
							all={false}
							options={[
								"5",
								"10",
								"20",
								"30",
								"40",
								"50",
								"60",
								"70",
								"80",
								"90",
								"100",
								"200",
								"300",
								"400",
								"500",
								"600",
								"700",
								"800",
								"900",
								"1000",
							]}
							caretColor='#061914'
						/>
					)}
				/>
			</div>
			<br />
			<Pagination data={transactions} />
			<Modal onRequestClose={() => setShowModal(false)} show={showModal}>
				<div className='max-h-[65vh]'>
					<h2 className='text-secondary text-xl md:text-2xl'>
						Transaction Summary
					</h2>
					<hr className='my-6' />
					<div className='h-[500px] overflow-y-auto'>
						<section className='p-6 text-sm space-y-4 bg-[#0EA5790D] rounded-[10px]'>
							<h3 className='text-center text-secondary font-bold'>
								Transaction Summary
							</h3>

							<div className='flex justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									<div
										className={`currency-flag currency-flag-${transaction?.baseCurrency?.toLowerCase()}`}
									/>
									From
								</div>
								<div className='text-secondary font-bold'>
									{transaction?.baseCurrency} {transaction?.base}
								</div>
							</div>
							<div className='flex justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									<div
										className={`currency-flag currency-flag-${transaction?.targetCurrency?.toLowerCase()}`}
									/>
									To
								</div>
								<div className='text-secondary font-bold'>
									{transaction?.targetCurrency} {transaction?.target}
								</div>
							</div>
							<div className='flex justify-between'>
								<div className='text-primary font-medium flex items-center gap-2'>
									Kadavra fee
								</div>
								<div className='text-secondary font-bold'>
									{transaction?._transactionFee}
								</div>
							</div>
							<div className='flex gap-4 justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Trx Reference
								</div>
								<div className='text-secondary text-right capitalize font-bold'>
									{transaction?.transactionReference || "N/A"}
								</div>
							</div>

							<div className='text-sm text-primary text-center'>
								Debit Details
							</div>
							<div className='flex justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Customer Name
								</div>
								<div className='text-secondary capitalize font-bold'>
									{transaction?.firstName} {transaction?.lastName}
								</div>
							</div>
							<div className='flex justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Payment Channel
								</div>
								<div className='text-secondary capitalize font-bold'>
									{transaction?.paymentChannel || "N/A"}
								</div>
							</div>
							<div className='flex justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Debit Account Number
								</div>
								<div className='text-secondary capitalize font-bold'>
									{transaction?.debitAccountNumber || "N/A"}
								</div>
							</div>
							<div className='flex justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Debit Bank Name
								</div>
								<div className='text-secondary capitalize font-bold'>
									{transaction?.debitBankName || "N/A"}
								</div>
							</div>
							<div className='flex gap-4 justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Payment Reference
								</div>
								<div className='text-secondary text-right capitalize font-bold'>
									{transaction?.paymentReference || "N/A"}
								</div>
							</div>
							<div className='flex justify-between text-right'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Payment Status
								</div>
								<div className='text-secondary capitalize font-bold'>
									<div
										style={{
											color:
												transaction?.paymentStatus?.toLowerCase() === "success"
													? "#1EB53A"
													: transaction?.paymentStatus?.toLowerCase() ===
													  "pending"
													? "#D4AF0F"
													: "#CE1126",
										}}>
										{transaction?.paymentStatus}
									</div>
									<div>
										{transaction?.paymentStatus?.toLowerCase() === "success" &&
											transaction?.paymentDate &&
											formatter?.format(new Date(transaction?.paymentDate))}
									</div>
								</div>
							</div>

							<div className='text-sm text-primary text-center'>
								Credit Details
							</div>
							<div className='flex justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Type of account
								</div>
								<div className='text-secondary font-bold'>
									{transaction?.recipientDetails?.accountType}
								</div>
							</div>
							<div className='flex justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Recipient Name
								</div>
								<div className='text-secondary font-bold'>
									{transaction?.recipientDetails?.beneficiaryName ||
										transaction?.recipientDetails?.accountName ||
										`${transaction?.recipientDetails?.firstName || "N/A"} ${
											transaction?.recipientDetails?.lastName || ""
										}`}
								</div>
							</div>
							<div className='flex justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Bank Name
								</div>
								<div className='text-secondary font-bold'>
									{transaction?.recipientDetails?.bankName || "N/A"}
								</div>
							</div>
							<div className='flex justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Account Number
								</div>
								<div className='text-secondary font-bold'>
									{transaction?.recipientDetails?.accountNumber || "N/A"}
								</div>
							</div>
							<div className='flex justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Account Name
								</div>
								<div className='text-secondary capitalize font-bold'>
									{transaction?.recipientDetails?.accountName ||
										transaction?.recipientDetails?.beneficiaryName ||
										transaction?.recipientDetails?.accountName ||
										`${transaction?.recipientDetails?.firstName || "N/A"} ${
											transaction?.recipientDetails?.lastName || ""
										}` ||
										"N/A"}
								</div>
							</div>
							<div className='flex justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Disbursement Status
								</div>
								<div className='text-secondary text-right capitalize font-bold'>
									<div
										style={{
											color:
												transaction?.disbursementStatus?.toLowerCase() ===
												"success"
													? "#1EB53A"
													: transaction?.disbursementStatus?.toLowerCase() ===
													  "pending"
													? "#D4AF0F"
													: "#CE1126",
										}}>
										{transaction?.disbursementStatus}
									</div>
									<div>
										{(transaction?.disbursementStatus?.toLowerCase() ===
											"success" &&
											transaction?.disbursementDate &&
											formatter?.format(
												new Date(transaction?.disbursementDate)
											)) ||
											"---"}
									</div>
								</div>
							</div>
							{/* <div className='flex gap-4 justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Disbursement Retries
								</div>
								<div className='text-secondary text-right capitalize font-bold'>
									{transaction?.disbursementRetries || "N/A"}
								</div>
							</div>
							<div className='flex gap-6 justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Disbursement Comments
								</div>
								<div className='text-secondary text-right capitalize font-medium'>
									{transaction?.disbursementComments || "N/A"}
								</div>
							</div> */}
						</section>
					</div>
				</div>
				<br />
				<Button
					loading={isDownloadingReceipt}
					className='w-full'
					size='sm'
					onClick={downloadPdfDocument}>
					Download Receipt
				</Button>
			</Modal>
			<div className='absolute translate-x-[-1000vh]'>
				<div id='testId' className='p-5 w-[650px]'>
					<h2 className='text-primary text-center text-xl md:text-2xl'>
						Kadavra Transaction Receipt
					</h2>
					<hr className='my-6' />
					<div className=''>
						<section className='p-6 text-sm space-y-4 bg-[#0EA5790D] rounded-[10px]'>
							<h3 className='text-center text-secondary font-bold'>
								Transaction Summary
							</h3>

							<div className='flex justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									From
								</div>
								<div className='text-secondary font-bold'>
									{transaction?.baseCurrency} {transaction?.base}
								</div>
							</div>
							<div className='flex justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									To
								</div>
								<div className='text-secondary font-bold'>
									{transaction?.targetCurrency} {transaction?.target}
								</div>
							</div>
							<div className='flex justify-between'>
								<div className='text-primary font-medium flex items-center gap-2'>
									Kadavra fee
								</div>
								<div className='text-secondary font-bold'>
									{transaction?._transactionFee}
								</div>
							</div>
							<div className='flex gap-4 justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Trx Reference
								</div>
								<div className='text-secondary text-right capitalize font-bold'>
									{transaction?.transactionReference || "N/A"}
								</div>
							</div>

							<div className='text-sm text-primary text-center'>
								Debit Details
							</div>
							<div className='flex justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Customer Name
								</div>
								<div className='text-secondary capitalize font-bold'>
									{transaction?.firstName} {transaction?.lastName}
								</div>
							</div>
							<div className='flex justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Payment Channel
								</div>
								<div className='text-secondary capitalize font-bold'>
									{transaction?.paymentChannel || "N/A"}
								</div>
							</div>
							<div className='flex justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Debit Account Number
								</div>
								<div className='text-secondary capitalize font-bold'>
									{transaction?.debitAccountNumber || "N/A"}
								</div>
							</div>
							<div className='flex justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Debit Bank Name
								</div>
								<div className='text-secondary capitalize font-bold'>
									{transaction?.debitBankName || "N/A"}
								</div>
							</div>
							<div className='flex gap-4 justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Payment Reference
								</div>
								<div className='text-secondary text-right capitalize font-bold'>
									{transaction?.paymentReference || "N/A"}
								</div>
							</div>
							<div className='flex justify-between text-right'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Payment Status
								</div>
								<div className='text-secondary capitalize font-bold'>
									<div
										style={{
											color:
												transaction?.paymentStatus?.toLowerCase() === "success"
													? "#1EB53A"
													: transaction?.paymentStatus?.toLowerCase() ===
													  "pending"
													? "#D4AF0F"
													: "#CE1126",
										}}>
										{transaction?.paymentStatus}
									</div>
									<div>
										{transaction?.paymentStatus?.toLowerCase() === "success" &&
											transaction?.paymentDate &&
											formatter?.format(new Date(transaction?.paymentDate))}
									</div>
								</div>
							</div>

							<div className='text-sm text-primary text-center'>
								Credit Details
							</div>
							<div className='flex justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Type of account
								</div>
								<div className='text-secondary font-bold'>
									{transaction?.recipientDetails?.accountType}
								</div>
							</div>
							<div className='flex justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Recipient Name
								</div>
								<div className='text-secondary font-bold'>
									{transaction?.recipientDetails?.beneficiaryName ||
										transaction?.recipientDetails?.accountName ||
										`${transaction?.recipientDetails?.firstName || "N/A"} ${
											transaction?.recipientDetails?.lastName || ""
										}`}
								</div>
							</div>
							<div className='flex justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Bank Name
								</div>
								<div className='text-secondary font-bold'>
									{transaction?.recipientDetails?.bankName || "N/A"}
								</div>
							</div>
							<div className='flex justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Account Number
								</div>
								<div className='text-secondary font-bold'>
									{transaction?.recipientDetails?.accountNumber || "N/A"}
								</div>
							</div>
							<div className='flex justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Account Name
								</div>
								<div className='text-secondary capitalize font-bold'>
									{transaction?.recipientDetails?.accountName ||
										transaction?.recipientDetails?.beneficiaryName ||
										transaction?.recipientDetails?.accountName ||
										`${transaction?.recipientDetails?.firstName || "N/A"} ${
											transaction?.recipientDetails?.lastName || ""
										}` ||
										"N/A"}
								</div>
							</div>
							<div className='flex justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Disbursement Status
								</div>
								<div className='text-secondary text-right capitalize font-bold'>
									<div
										style={{
											color:
												transaction?.disbursementStatus?.toLowerCase() ===
												"success"
													? "#1EB53A"
													: transaction?.disbursementStatus?.toLowerCase() ===
													  "pending"
													? "#D4AF0F"
													: "#CE1126",
										}}>
										{transaction?.disbursementStatus}
									</div>
									<div>
										{(transaction?.disbursementStatus?.toLowerCase() ===
											"success" &&
											transaction?.disbursementDate &&
											formatter?.format(
												new Date(transaction?.disbursementDate)
											)) ||
											"---"}
									</div>
								</div>
							</div>
							{/* <div className='flex gap-4 justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Disbursement Retries
								</div>
								<div className='text-secondary text-right capitalize font-bold'>
									{transaction?.disbursementRetries || "N/A"}
								</div>
							</div>
							<div className='flex gap-6 justify-between'>
								<div className='text-accent-gray font-medium flex items-center gap-2'>
									Disbursement Comments
								</div>
								<div className='text-secondary text-right capitalize font-medium'>
									{transaction?.disbursementComments || "N/A"}
								</div>
							</div> */}
						</section>
					</div>
				</div>
			</div>
		</DefaultLayout>
	);
};

export default TransactionPage;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
	wrapper.getServerSideProps((store) => async (context) => {
		const token = context.req.cookies.kadavraToken;

		store.dispatch(
			getTransactions.initiate({
				token,
				pageNumber: +context.query.page || 1,
				pageSize: +context.query.pageSize || 10,
				startDate: context.query.startDate?.toString() || "2022-01-01",
				endDate: context.query.endDate?.toString() || "2023-12-12",
				search: context.query.search?.toString() || "",
				status:
					(context.query.status?.toString() as
						| "PENDING"
						| "SUCCESS"
						| "FAILED"
						| "all") || "all",
			})
		);

		try {
			const response = await Promise.all(getRunningOperationPromises());
			console.log(response);
			return {
				props: {
					transactions: response[0]["data"] || [],
				},
			};
		} catch (error) {
			console.log(error);
			return {
				props: {
					transactions: {},
				},
			};
		}
	})
);
