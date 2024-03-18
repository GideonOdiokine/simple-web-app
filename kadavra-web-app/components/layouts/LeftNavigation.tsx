import { LeftNavigationProps } from "@/types/layouts/LeftNavigationProps";
import Link from "next/link";
import Navigations from "./Navigations";

const LeftNavigation = ({ navigations }: LeftNavigationProps) => {
	return (
		<nav className='bg-secondary fixed top-0 left-0 w-[272px] h-full'>
			<div className='my-4 ml-4 md:ml-[62px] md:my-[32px]'>
				<Link href='/'>
					<a>
						<img
							src='/logo.svg'
							className='w-[110px] md:w-auto'
							alt='Kadavra home logo'
						/>
					</a>
				</Link>
			</div>
			<Navigations navigations={navigations} />
		</nav>
	);
};

export default LeftNavigation;

LeftNavigation.defaultProps = {
	navigations: [
		{
			name: null,
			links: [
				{
					name: "Home",
					icon: "home",
					href: "/",
				},
				{
					name: "My Account",
					icon: "my-account",
					href: "/my-account",
					// slug: "/my-products",
					// query: "?t=product",
				},
			],
		},
		{
			name: "TRANSACTIONS",
			links: [
				{
					name: "Convert Currency",
					icon: "convert-currency",
					href: "/convert-currency",
				},
				{
					name: "Transaction Overview",
					icon: "transaction-overview",
					href: "/transaction-overview",
				},
			],
		},
		{
			name: "MY INFORMATION",
			links: [
				{
					name: "My Bank Details",
					icon: "my-bank-detail",
					href: "/bank-details",
				},
			],
		},
		{
			name: "SETTINGS",
			links: [
				{
					name: "Help & Support Center",
					icon: "help-support-center",
					href: process.env.NEXT_PUBLIC_DOMAIN_WEBSITE_URL + "faq",
					target: "_blank",
				},
			],
		},
	],
};
