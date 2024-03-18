import { GetServerSideProps, GetServerSidePropsContext } from "next";

export function requireAuthentication(gssp: GetServerSideProps) {
	return async (ctx: GetServerSidePropsContext) => {
		const { req } = ctx;

		const initialRoute = ctx.resolvedUrl || "/";

		try {
			const token = req.cookies.kadavraToken;
			if (!token) {
				return {
					redirect: {
						permanent: false,
						destination: `/auth/login?ref=${initialRoute}`,
					},
				};
			} else {
				return await gssp(ctx);
			}
		} catch (error) {
			return {
				redirect: {
					permanent: false,
					destination: `/auth/login?ref=${initialRoute}`,
				},
			};
		}
	};
}
