import { useRouter } from "next/router";
import Button from "../global/Button";
import StatusPill from "../global/StatusPill";
import WhiteWrapper from "../global/WhiteWrapper";

const Confirmation = () => {
	const router = useRouter();

	const { creditBankDetails, store } = router.query;

	return (
		<section className='grid grid-cols-1 md:grid-cols-7 gap-y-8 md:gap-8'>
			<section className='col-span-4'>
				<WhiteWrapper>
					<div className='text-center space-y-[6px]'>
						<h4 className='font-bold text-secondary text-xl capitalize'>
							Your exchanges has been set up 100%
						</h4>
						<p className='text-sm md:text-base text-accent-gray leading-[22px]'>
							100,000.00 NGN will be desducted from your account.this exchanges
							is now pending and will take place automatically
						</p>
					</div>

					<div className='p-5 mt-8 border border-[#D5DEDB] rounded-[5px] space-y-5'>
						<div className='flex items-center justify-between'>
							<span className='text-lg font-medium'>summary</span>
							<StatusPill status='Pending' />
						</div>

						<hr />

						<div className='flex flex-col lg:flex-row items-center justify-between gap-0 lg:gap-3'>
							<div className='border border-[#D5DEDB] rounded-[5px] p-5 w-full md:w-auto'>
								<img src='/assets/icons/flags/nigeria.svg' alt='' />
								<div className='text-base font-medium text-accent-gray text-center'>
									from
								</div>
								<div className='text-base font-bold text-secondary text-center'>
									100,000.00 NGN
								</div>
							</div>
							<svg
								className='w-12 h-12'
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
							<div className='border border-[#D5DEDB] rounded-[5px] p-5 w-full md:w-auto'>
								<img src='/assets/icons/flags/nigeria.svg' alt='' />
								<div className='text-base font-medium text-accent-gray text-center'>
									from
								</div>
								<div className='text-base font-bold text-secondary text-center'>
									100,000.00 NGN
								</div>
							</div>
						</div>
					</div>

					<div className='space-y-[5px] mt-8 text-sm lg:text-base rounded-[5px] '>
						<div className='text-accent-gray font-medium'>
							1 USD = <span className='text-secondary'>415.329 NGN</span>
						</div>
						<div className='text-accent-gray font-medium'>
							1 NGN = <span className='text-secondary'>0.00240773 USD</span>
						</div>
						<div className='text-primary text-sm font-medium'>
							Kadavra fee deducted{" "}
							<span className='text-base text-secondary'>(3 USD)</span>
						</div>
					</div>

					<hr className='mt-8' />

					<div className='mt-8 space-y-4'>
						<h5 className='text-sm text-primary text-center mb-6'>
							A payment via Bank transfer to account below
						</h5>
						<div className='text-base text-medium flex justify-between items-center'>
							<div className='text-secondary'>Type of account</div>
							<div className='text-accent-gray'>Naira account</div>
						</div>
						<div className='text-base text-medium flex justify-between items-center'>
							<div className='text-secondary'>Account Number</div>
							<div className='text-accent-gray'>3455666644</div>
						</div>
						<div className='text-base text-medium flex justify-between items-center'>
							<div className='text-secondary'>Account Name</div>
							<div className='text-accent-gray'>John Does</div>
						</div>
						<div className='text-base text-medium flex justify-between items-center'>
							<div className='text-secondary'>Bank Name</div>
							<div className='text-accent-gray'>Firstbank</div>
						</div>
					</div>

					<div className='bg-primary p-5 mt-8'>
						<div className='flex flex-col md:flex-row gap-5 justify-between items-start text-white'>
							<div className='text-lg font-medium'>Payment reference</div>
							<div className='w-[50%]'>
								<div className='text-2xl font-medium text-accent-yellow'>
									CF33455567
								</div>
								<div className='text-sm font-medium'>
									Lorem ipsum dolor sit amet, consectetur adi piscing elit. Diam
									phasellus bibendum.
								</div>
							</div>
							<div className='flex items-center gap-4 className="text-sm font-medium"'>
								Copy
								<img src='/assets/icons/convert-currency/copy.svg' alt='' />
							</div>
						</div>
					</div>

					<div className='flex mt-8 gap-4'>
						<div className='h-6 w-6'>
							<img src='/assets/icons/convert-currency/info.svg' alt='' />
						</div>
						<div className='w-[calc(100%-30px)]'>
							<p className='text-sm md:text-base text-accent-gray leading-[22px]'>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.Elit
								elit nunc a accumsan. Faucibus enim.
							</p>
						</div>
					</div>
				</WhiteWrapper>
			</section>
			<section className='col-span-3 space-y-8'>
				<WhiteWrapper>
					<article className='flex gap-4'>
						<div className='h-6 w-6'>
							<img src='/assets/icons/convert-currency/time.svg' alt='' />
						</div>
						<div className='w-[calc(100%-30px)]'>
							<h4 className='font-bold text-secondary text-xl'>
								Time estimation
							</h4>
							<p className='text-sm md:text-base text-accent-gray leading-[22px]'>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
								ridiculus metus, mattis sed massa tempor. Libero.
							</p>
							<p className='text-lg text-accent-gray font-bold'>
								<span className='text-primary'>2 hour</span> from 13:11 PM-31st
								june
							</p>
						</div>
					</article>
				</WhiteWrapper>
				<WhiteWrapper>
					<article className='flex gap-4'>
						<div className='h-6 w-6'>
							<img src='/assets/icons/convert-currency/message.svg' alt='' />
						</div>
						<div className='w-[calc(100%-30px)]'>
							<h4 className='font-bold text-secondary text-xl'>
								We’ll keep you updated
							</h4>
							<p className='text-sm md:text-base text-accent-gray leading-[22px]'>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit Habitant
								gravida turpis eu praesent. Nisl est faucibus velit mi.
							</p>
						</div>
					</article>
				</WhiteWrapper>
				{creditBankDetails === "cashAtHand" && (
					<WhiteWrapper>
						<article className='flex gap-4'>
							<div className='h-6 w-6'>
								<img src='/assets/icons/convert-currency/location.svg' alt='' />
							</div>
							<div className='w-[calc(100%-30px)]'>
								<h4 className='font-bold text-secondary text-xl capitalize'>
									{store}
								</h4>
								<p className='text-sm md:text-base text-accent-gray leading-[22px]'>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit
									Habitant gravida turpis eu praesent. Nisl est faucibus velit
									mi.
								</p>
								<Button
									theme='outline'
									size='sm'
									className='mt-2'
									icon='green-plus'>
									Copy Address
								</Button>
							</div>
						</article>
					</WhiteWrapper>
				)}
				<Button href='/' size='sm' onClick={() => router.push("/")}>
					Home
				</Button>
			</section>
		</section>
	);
};

export default Confirmation;
