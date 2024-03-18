import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import ConvertCurrencyFlowWrapper from "@/components/convert-currency/ConvertCurrencyFlowWrapper";
import Button from "@/components/global/Button";
import WhiteWrapper from "@/components/global/WhiteWrapper";
import DefaultLayout from "@/layouts/DefaultLayout";
import { requireAuthentication } from "@/hoc/requireAuthentication";
import EnterAmount from "@/components/convert-currency/EnterAmount";
import CreditDetails from "@/components/convert-currency/CreditDetails";
import PaymentDetails from "@/components/convert-currency/PaymentDetails";
import SelectMethod from "@/components/convert-currency/SelectMethod";
import Confirmation from "@/components/convert-currency/Confirmation";

const ConvertCurrency: NextPage = () => {
	const router = useRouter();

	const { step, method, store } = router.query;

	return (
		<DefaultLayout title='Convert Currency'>
			<ConvertCurrencyFlowWrapper
				show={
					step !== undefined && step !== "" && method !== "cash" ? true : false
				}
				step={step || 0}>
				{(step === undefined || step === "") && <SelectMethod />}

				{method === "cash" && step === "1" && (
					<WhiteWrapper>
						<div className='grid grid-cols-1 sm:grid-cols-7 gap-0 sm:gap-8'>
							<article className='col-span-2'>
								<h3 className='text-secondary font-bold text-lg md:text-xl mb-2'>
									Address Details
								</h3>
								<p className='text-accent-gray font-medium w-full text-sm md:text-base sm:max-w-[230px] leading-[22px]'>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut.
								</p>
								<hr className='my-8 sm:hidden' />
							</article>
							<section className='col-span-5'>
								<form className='w-full xl:max-w-[70%] space-y-7'>
									<div className='form-check flex'>
										<input
											className='form-check-input appearance-none rounded-full h-6 w-6 border border-gray-300 bg-white checked:bg-primary checked:border-primary focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer'
											type='radio'
											name='store'
											id='Surulere Store'
											value='Surulere Store'
											checked={store === "Surulere Store"}
											onChange={() =>
												router.replace({
													query: {
														...router.query,
														store: "Surulere Store",
													},
												})
											}
										/>
										<label
											className='form-check-label mt-[0.5px] cursor-pointer w-[calc(100%-32px)] inline-block text-gray-800'
											htmlFor='Surulere Store'>
											<article>
												<h4 className='font-bold text-secondary'>
													Surulere Store
												</h4>
												<p className='font-medium text-sm lg:text-base text-accent-gray leading-[22px]'>
													Lorem ipsum dolor sit amet, consectetur adipiscing
													elit. Sem eget id bibendum iaculis tincidunt cum.
													Consequat id sit leo nunc mattis nec. Dolor ut gravida
													cras amet. Ultrices netus enim lorem etiam nisi
													laoreet ut dignissim purus. Ut et sed.
												</p>
											</article>
											<Button
												size='sm'
												className='mt-[5px]'
												icon='green-plus'
												theme='outline'>
												Copy Address
											</Button>
										</label>
									</div>

									<div className='form-check flex'>
										<input
											className='form-check-input appearance-none rounded-full h-6 w-6 border border-gray-300 bg-white checked:bg-primary checked:border-primary focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer'
											type='radio'
											name='store'
											id='ifako ijaye Store'
											value='ifako ijaye Store'
											checked={store === "ifako ijaye Store"}
											onChange={() =>
												router.replace({
													query: {
														...router.query,
														store: "ifako ijaye Store",
													},
												})
											}
										/>
										<label
											className='form-check-label mt-[0.5px] cursor-pointer w-[calc(100%-32px)] inline-block text-gray-800'
											htmlFor='ifako ijaye Store'>
											<article>
												<h4 className='font-bold text-secondary'>
													Ifako ijaye Store
												</h4>
												<p className='font-medium text-sm lg:text-base text-accent-gray leading-[22px]'>
													Lorem ipsum dolor sit amet, consectetur adipiscing
													elit. Sem eget id bibendum iaculis tincidunt cum.
													Consequat id sit leo nunc mattis nec. Dolor ut gravida
													cras amet. Ultrices netus enim lorem etiam nisi
													laoreet ut dignissim purus. Ut et sed.
												</p>
											</article>
											<Button
												size='sm'
												className='mt-[5px]'
												icon='green-plus'
												theme='outline'>
												Copy Address
											</Button>
										</label>
									</div>
									<div className='w-full'>
										<Button
											size='sm'
											className='mt-[5px] flex-1 w-full md:w-1/2'
											onClick={() =>
												router.push({
													pathname: router.pathname,
													query: {
														...router.query,
														step: undefined,
														store: undefined,
													},
												})
											}>
											Back
										</Button>
									</div>
								</form>
							</section>
						</div>
					</WhiteWrapper>
				)}

				{step === "1" && method !== "cash" && <EnterAmount />}

				{step === "2" && <CreditDetails />}

				{step === "3" && <PaymentDetails />}

				{step === "4" && <Confirmation />}
			</ConvertCurrencyFlowWrapper>
		</DefaultLayout>
	);
};

export default ConvertCurrency;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
	async (context) => {
		return {
			props: {},
		};
	}
);
