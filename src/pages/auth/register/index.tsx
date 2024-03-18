import { useRouter } from "next/router";
import { useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
import { checkAuthentication } from "@/hoc/checkAuthentication";
import AuthLayout from "@/layouts/AuthLayout";
import RegisterUser from "@/components/auth/register/RegisterUser";
import Success from "@/components/auth/register/Success";
import VerifyBVN from "@/components/auth/register/VerifyBVN";
import VerifyEmail from "@/components/auth/register/VerifyEmail";
import VerifyPhone from "@/components/auth/register/VerifyPhone";
import { RegisterUserResponse } from "@/types/auth/auth";

const Register: NextPage = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState(null);

	const { step } = router.query;

	const getUser = (user: RegisterUserResponse) => {
		setUser(user);
	};

	return (
		<AuthLayout loading={loading}>
			{(step === "1" || step === undefined) && (
				<VerifyBVN getLoading={(loading) => setLoading(loading)} />
			)}

			{step === "verify-phone" && (
				<VerifyPhone getLoading={(loading) => setLoading(loading)} />
			)}

			{step === "verify-email" && (
				<VerifyEmail getLoading={(loading) => setLoading(loading)} />
			)}

			{step === "register-user" && <RegisterUser getUser={getUser} />}

			{step === "success" && <Success user={user} />}
		</AuthLayout>
	);
};

export default Register;

export const getServerSideProps: GetServerSideProps = checkAuthentication(
	async (context) => {
		return {
			props: {},
		};
	}
);
