import LeftNavigation from "@/components/layouts/LeftNavigation";
import Head from "next/head";
import { Twirl as Hamburger } from "hamburger-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { UserResponse } from "@/types/auth/auth";
import Link from "next/link";

type DefaultLayoutProps = {
	title: string;
	children?: React.ReactNode;
	goBack?: boolean;
};

const SessionTimeOut = dynamic(
	() => import("@/components/session-timeout/SessionTimeOut"),
	{
		ssr: false,
	}
);

const DefaultLayout = ({
	title,
	goBack = false,
	children,
}: DefaultLayoutProps) => {
	const [isOpen, setOpen] = useState(false);
	const [user, setUser] = useState<UserResponse>();

	useEffect(() => {
		try {
			const user = JSON.parse(Cookies.get("kadavraUserDetails"));
			setUser(user);
		} catch (error) {
			console.log(error);
		}
	}, []);

	const closeModal = (e: any) => {
		if (e.target.classList.contains("overlay")) {
			setOpen(false);
		}
	};

	const router = useRouter();

	return (
		<div className='flex w-full'>
			<Head>
				<title>{title}</title>
			</Head>
			{isOpen && (
				<div
					onClick={closeModal}
					className='fixed-top z-40 left-0 overlay bg-[#061A1480] w-screen h-screen'
				/>
			)}
			<aside
				className={`xl:hidden h-screen z-50 ${
					isOpen
						? "fixed top-[64px] left-0 transform transition-transform"
						: "-translate-x-[100vw] xl:translate-x-0"
				}`}>
				<LeftNavigation />
			</aside>
			<aside className={`hidden xl:block w-[272px] h-screen z-50`}>
				<LeftNavigation />
			</aside>
			<SessionTimeOut />
			<section className='pt-4 xl:pt-8 p-6 xl:p-14 w-full xl:w-[calc(100%-272px)] overflow-hidden min-h-screen bg-[#F4F5F7]'>
				<header className='w-full'>
					<div className='w-full flex justify-between xl:justify-end mb-[48px] fixed-top bg-white xl:bg-transparent px-4 py-2 xl:static xl:p-0'>
						<div className='xl:hidden'>
							<Hamburger
								color='#0b211a'
								size={32}
								label='Show menu'
								toggled={isOpen}
								toggle={setOpen}
							/>
						</div>
						{user && (
							<div className='flex items-center space-x-5'>
								<img src='/assets/icons/flags/nigeria.svg' alt='nigeria flag' />
								<Link href='/my-account'>
									<a className='font-medium text-secondary'>
										{user.firstName} {user.lastName}
									</a>
								</Link>
								{/* <svg
									width='24'
									height='24'
									viewBox='0 0 24 24'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'>
									<path
										d='M6 9L12 15L18 9L6 9Z'
										fill='#061A14'
										stroke='#061A14'
										strokeWidth='1.5'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg> */}
							</div>
						)}
					</div>
					<div className='flex items-center gap-3 mt-24 xl:mt-0 '>
						{goBack && (
							<button onClick={() => router.back()}>
								<svg
									width='36'
									height='36'
									viewBox='0 0 36 36'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'>
									<path
										d='M6.375 18.4102L28.875 18.4102'
										stroke='#0EA579'
										strokeWidth='3'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
									<path
										d='M15.4497 27.4485L6.37471 18.4125L15.4497 9.375'
										stroke='#0EA579'
										strokeWidth='3'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
							</button>
						)}
						<h1 className='font-bold text-2xl lg:text-4xl text-secondary'>
							{title}
						</h1>
					</div>
					<hr className='border-1 border-b border-gray-300 my-5 mb-6 xl:my-6' />
				</header>
				<main>{children}</main>
			</section>
		</div>
	);
};

export default DefaultLayout;

DefaultLayout.defaultProps = {
	title: "Kadavra",
};
