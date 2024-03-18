import { useRouter } from "next/router";
import Button from "../global/Button";
import StatusPill from "../global/StatusPill";
import WhiteWrapper from "../global/WhiteWrapper";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type TransactionsReviewProps = {
	transactionsCount: {
		data: {
			totalCompleted: number;
			totalFailed: number;
			totalPending: number;
		};
	};
};

const TransactionsReview = ({ transactionsCount }: TransactionsReviewProps) => {
	const router = useRouter();

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		autoplay: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplaySpeed: 6000,
		arrows: false,
		cssEase: "linear",
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					// dots: false,
				},
			},
			{
				breakpoint: 600,
				settings: {
					// dots: false,
				},
			},
			{
				breakpoint: 480,
				settings: {
					// dots: false,
				},
			},
		],
	};
	return (
		<section className='flex flex-col xl:flex-row gap-8'>
			<WhiteWrapper className='flex-[3]'>
				<article className='flex h-full gap-5 flex-col justify-between'>
					<div className='flex items-center  flex-wrap gap-3 justify-between'>
						<StatusPill status='Pending' />
						<Button
							tag='a'
							href='/transaction-overview?status=Pending'
							className='text-sm'>
							View Pending Transaction
						</Button>
					</div>
					<div className='flex justify-between'>
						<div>
							<h2 className='text-secondary text-lg font-bold'>
								Pending Transactions
							</h2>
							<p className='text-sm text-accent-gray leading-4'>
								Summary of all transactions yet to be completed.
							</p>
						</div>
						<div className='text-secondary text-5xl font-bold ml-4'>
							{transactionsCount?.data?.totalPending || 0}
						</div>
					</div>
					<Button
						className='w-full text-sm'
						size='sm'
						onClick={() => router.push("/convert-currency")}>
						Convert Currency
					</Button>
				</article>
			</WhiteWrapper>

			<section className='hidden md:flex flex-[4.5] flex-col md:flex-row md:justify-between gap-8'>
				<WhiteWrapper className='w-full'>
					<article className='space-y-5'>
						<StatusPill status='Completed' />

						<div className='flex flex-col gap-2 justify-between'>
							<div>
								<h2 className='text-secondary text-lg font-bold'>
									Completed Transactions
								</h2>
								<p className='text-sm text-accent-gray leading-4'>
									Summary of all transaction successfully completed.
								</p>
								<div className='text-secondary text-3xl font-bold mt-2'>
									{transactionsCount?.data?.totalCompleted || 0}
								</div>
							</div>
							<div className='flex justify-end'>
								<Button
									tag='a'
									href='/transaction-overview?status=Success'
									className='text-sm'>
									View Completed Transaction
								</Button>
							</div>
						</div>
					</article>
				</WhiteWrapper>
				<WhiteWrapper className='w-full'>
					<article className='space-y-5'>
						<StatusPill status='Failed' />

						<div className='flex flex-col gap-2 justify-between'>
							<div>
								<h2 className='text-secondary text-lg font-bold'>
									Failed Transactions
								</h2>
								<p className='text-sm text-accent-gray leading-4'>
									Summary of all failed and unsuccessful transactions.
								</p>
								<div className='text-secondary text-3xl font-bold mt-2'>
									{transactionsCount?.data?.totalFailed || 0}
								</div>
							</div>
							<div className='flex justify-end'>
								<Button
									tag='a'
									href='/transaction-overview?status=Failed'
									className='text-sm'>
									View Failed Transaction
								</Button>
							</div>
						</div>
					</article>
				</WhiteWrapper>
			</section>

			<section className='md:hidden'>
				<Slider {...settings}>
					<div className='px[3px]1 by32'>
						<WhiteWrapper>
							<article className='space-y-5'>
								<StatusPill status='Completed' />

								<div className='flex flex-col gap-2 justify-between'>
									<div>
										<h2 className='text-secondary text-lg font-bold'>
											Completed Transactions
										</h2>
										<p className='text-sm text-accent-gray leading-4'>
											Summary of all transaction successfully completed.
										</p>
										<div className='text-secondary text-3xl font-bold mt-2'>
											{transactionsCount?.data?.totalCompleted || 0}
										</div>
									</div>
									<div className='flex justify-end'>
										<Button tag='a' className='text-sm'>
											View Completed Transaction
										</Button>
									</div>
								</div>
							</article>
						</WhiteWrapper>
					</div>
					<div className='px-[3px] pb-3'>
						<WhiteWrapper>
							<article className='space-y-5'>
								<StatusPill status='Failed' />

								<div className='flex flex-col gap-2 justify-between'>
									<div>
										<h2 className='text-secondary text-lg font-bold'>
											Failed Transactions
										</h2>
										<p className='text-sm text-accent-gray leading-4'>
											Summary of all failed and unsuccessful transactions.
										</p>
										<div className='text-secondary text-3xl font-bold mt-2'>
											{transactionsCount?.data?.totalFailed || 0}
										</div>
									</div>
									<div className='flex justify-end'>
										<Button tag='a' className='text-sm'>
											View Failed Transaction
										</Button>
									</div>
								</div>
							</article>
						</WhiteWrapper>
					</div>
				</Slider>
			</section>
		</section>
	);
};

export default TransactionsReview;
