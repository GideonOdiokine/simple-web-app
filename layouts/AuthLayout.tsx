import React from "react";
import Head from "next/head";
import AuthArts from "@/components/layouts/AuthArts";
import ProgressBar from "@/components/global/ProgressBar/ProgressBar";

type AuthLayoutProps = {
	title: string;
	children: React.ReactNode;
	loading?: boolean;
};

const AuthLayout = ({ title, children, loading = false }: AuthLayoutProps) => {
	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<main className='container flex items-center justify-center w-full h-full min-h-screen'>
				<AuthArts />
				<section className='w-full max-w-[675px] overflow-x-hidden relative z-10 my-6 py-16 bg-white rounded-xl kadavra-shadow'>
					{loading && (
						<div className='absolute top-0 left-0 right-0'>
							<ProgressBar value={0.7} indeterminate={true} />
						</div>
					)}
					<div className='w-full max-w-[479px] mx-auto space-y-[40px] p-6'>
						{children}
					</div>
				</section>
			</main>
		</>
	);
};

export default AuthLayout;

AuthLayout.defaultProps = {
	children: null,
	title: "Kadavra | Welcome",
};
