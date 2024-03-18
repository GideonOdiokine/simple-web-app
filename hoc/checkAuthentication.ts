import { GetServerSideProps, GetServerSidePropsContext } from "next";

export function checkAuthentication(gssp: GetServerSideProps) {
	return async (ctx: GetServerSidePropsContext) => {
		const { req } = ctx;

		const initialRoute =
			req.headers.referer === process.env.NEXT_PUBLIC_DOMAIN_WEBSITE_URL
				? "/"
				: req.headers.referer;

		try {
			const token = req.cookies.kadavraToken;

			if (token) {
				return {
					redirect: {
						destination: initialRoute || "/",
						permanent: false,
					},
				};
			} else {
				return gssp(ctx);
			}
		} catch (error) {
			return {
				redirect: {
					permanent: false,
					destination: "/auth/login",
				},
			};
		}
	};
}
