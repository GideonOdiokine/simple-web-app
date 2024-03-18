import { useRouter } from "next/router";
import { useEffect } from "react";
import Button from "../global/Button";
import StatusPill from "../global/StatusPill";
import WhiteWrapper from "../global/WhiteWrapper";

const SelectMethod = () => {
	const router = useRouter();

	const { method } = router.query;

	useEffect(() => {
		router.replace({
			query: { ...router.query, method: "bankOrCard" },
		});
	}, []);

	return (
		<WhiteWrapper>
			<div className='grid grid-cols-1 sm:grid-cols-7 gap-0 sm:gap-8'>
				<article className='col-span-2'>
					<h3 className='text-secondary font-bold text-lg md:text-xl mb-2'>
						Select method
					</h3>
					<p className='text-accent-gray font-medium w-full text-sm md:text-base sm:max-w-[230px] leading-[22px]'>
						What exchange method will like to use for this transaction.
					</p>
					<hr className='my-8 sm:hidden' />
				</article>
				<section className='col-span-5'>
					<form className='space-y-5'>
						<div className='form-check flex'>
							<input
								className='form-check-input appearance-none rounded-full h-6 w-6 border border-gray-300 bg-white checked:bg-primary checked:border-primary focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer'
								type='radio'
								name='conversionMethod'
								id='bankOrCard'
								value='bankOrCard'
								checked={method === "bankOrCard"}
								onChange={() =>
									router.replace({
										query: { ...router.query, method: "bankOrCard" },
									})
								}
							/>
							<label
								className='form-check-label mt-[0.5px] cursor-pointer w-[calc(100%-32px)] inline-block text-gray-800'
								htmlFor='bankOrCard'>
								<article>
									<h4 className='font-bold text-secondary'>
										Bank or card conversion method.
									</h4>
									<p className='font-medium text-sm lg:text-base text-accent-gray leading-[22px]'>
										Complete your exchange with your credit card or bank
										details.
									</p>
								</article>
							</label>
						</div>

						<div className='form-check flex'>
							<input
								className='form-check-input appearance-none rounded-full h-6 w-6 border border-gray-300 bg-white checked:bg-primary checked:border-primary focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer'
								type='radio'
								name='conversionMethod'
								id='cash'
								value='cash'
								checked={method === "cash"}
								disabled
								onChange={() =>
									router.replace({
										query: { ...router.query, method: "cash" },
									})
								}
							/>
							<label
								className='form-check-label mt-[0.5px] cursor-pointer w-[calc(100%-32px)] inline-block text-gray-800'
								htmlFor='cash'>
								<article>
									<div className='flex items-center gap-4'>
										<h4 className='font-bold text-secondary'>Cash Method</h4>
										<StatusPill status='Coming soon' />
									</div>
									<p className='font-medium text-sm lg:text-base text-accent-gray leading-[22px]'>
										Complete your exchange rate with cash at hand.
									</p>
								</article>
							</label>
						</div>
						<div className='pl-7'>
							<Button
								size='sm'
								disabled={method === "" || method === undefined}
								onClick={() =>
									router.push({
										pathname: router.pathname,
										query: { ...router.query, step: "1" },
									})
								}>
								Continue
							</Button>
						</div>
					</form>
				</section>
			</div>
		</WhiteWrapper>
	);
};

export default SelectMethod;
