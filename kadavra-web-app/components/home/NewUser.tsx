import Button from "@/components/global/Button";
import WhiteWrapper from "@/components/global/WhiteWrapper";
import DefaultLayout from "@/layouts/DefaultLayout";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useRouter } from "next/router";
import Link from "next/link";

type Props = {
	services: {
		title: string;
		icon: string;
		description: string;
	}[];
};

const NewUser = ({ services }: Props) => {
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
		<DefaultLayout title='Get started with Kadavra'>
			<WhiteWrapper>
				<div className='flex flex-col-reverse md:flex-row lg:items-center justify-between gap-6'>
					<div className='w-full xl:max-w-[70%]'>
						<h2 className='text-secondary font-bold text-xl lg:text-2xl mb-2'>
							Buy Currency at the Best Exchange Rate in Nigeria.
						</h2>
						<p className='text-sm lg:text-lg text-accent-gray leading-[29px] mb-5'>
							Get your currency delivered to your home, ready for collection at
							your nearest branch or via a Travel Money Card.
						</p>
						<Link href='/convert-currency' passHref>
							<a>
								<Button className='w-full md:w-auto' size='sm'>
									Convert Now
								</Button>
							</a>
						</Link>
					</div>
					<img
						src='/assets/images/home/identity-verified.svg'
						className='w-[167px] xl:w-auto'
						alt=''
					/>
				</div>
			</WhiteWrapper>

			<section className='mt-10 xl:mt-16 pb-16'>
				<h2 className='text-secondary font-bold text-xl md:text-2xl mb-2 md:mb-6'>
					Your overview of our services
				</h2>

				<section className='hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-12'>
					{services.map((service, index) => (
						<WhiteWrapper key={service.title + index}>
							<article>
								<img className='mb-4' src={service.icon} alt='' />
								<h3 className='font-bold text-xl text-secondary mb-2'>
									{service.title}
								</h3>
								<p className='text-sm xl:text-lg text-accent-gray leading-[29px]'>
									{service.description}
								</p>
							</article>
						</WhiteWrapper>
					))}
				</section>

				<section className='md:hidden'>
					<Slider {...settings}>
						{services.map((service, index) => (
							<div className='px-1.5 py-3' key={service.title + index}>
								<WhiteWrapper>
									<article>
										<img className='mb-4' src={service.icon} alt='' />
										<h3 className='font-bold text-xl text-secondary mb-2'>
											{service.title}
										</h3>
										<p className='text-sm text-accent-gray leading-[29px]'>
											{service.description}
										</p>
									</article>
								</WhiteWrapper>
							</div>
						))}
					</Slider>
				</section>
			</section>
		</DefaultLayout>
	);
};

export default NewUser;

NewUser.defaultProps = {
	services: [
		{
			title: "Currency Converter",
			icon: "/assets/images/home/currency-converter.svg",
			description:
				"Foreign exchange solutions for your personal needs, how you want it and when you need it. Kadavra works to make your transactions simple, efficient and cost-effective.",
		},
		{
			title: "Exchange Rate",
			icon: "/assets/images/home/exchange-rate.svg",
			description:
				"We provide competitive rates, which means more cash in your pocket every time. Get a quote now to see what great rates we can do for you.",
		},
		{
			title: "Kadavra Location",
			icon: "/assets/images/home/kadavra-location.svg",
			description:
				"Order the foreign cash you need. Get the best rates online. Collect your foreign cash at any of our Click & Collect locations nationwide. It is that easy.",
		},
	],
};
