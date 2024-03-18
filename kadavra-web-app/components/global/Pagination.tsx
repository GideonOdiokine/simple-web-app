import { useRouter } from "next/router";

type Props = {
	data: {
		pageNumber: number;
		pageSize: number;
		responseCode: string;
		totalCount: number;
		data?: any;
	};
};

const Pagination = ({ data }: Props) => {
	const { pageNumber, totalCount, pageSize } = data;

	const router = useRouter();

	const { page: _page } = router.query;

	const totalPages = Math.ceil(totalCount / pageSize);

	const hasNextPage = (): boolean => {
		const count = totalPages;
		return pageNumber < count ? true : false;
	};

	const hasPrevPage = (): boolean => {
		return pageNumber.toString() !== "1";
	};

	const pages = (): string[] => {
		const count = totalPages;
		const p = [];
		for (let i = 0; i < count; i++) {
			p.push(String(i + 1));
		}
		return p;
	};

	const closePages = (): string[] => {
		if (pages().length >= 7) {
			const p: string[] = [];
			for (let i = 0; i < 3; i++) {
				if (
					pageNumber + i <= pages().length &&
					!p.includes(String(pageNumber + i))
				)
					p.push(String(pageNumber + i));
			}
			for (let i = 0; i < 3; i++) {
				if (pageNumber - i >= 1 && !p.includes(String(pageNumber - i)))
					p.push(String(pageNumber - i));
			}

			let set = new Set<string>(p);

			set.add("1");
			set.add(totalPages.toString());

			let calPages = [...set].sort((a, b) => +a - +b);

			if (!calPages.includes("2")) {
				calPages.splice(1, 0, "...");
			}

			if (!calPages.includes((totalPages - 1).toString())) {
				calPages.splice(calPages.length - 1, 0, "...");
			}

			return calPages;
		}
	};

	const pagPages = pages().length < 7 ? pages() : closePages();

	if (pages().length < 2) {
		return <></>;
	}

	// console.log(closePages());

	return (
		<section className='flex justify-center md:justify-end'>
			<div className='flex items-center'>
				<button
					disabled={!hasPrevPage()}
					onClick={() => {
						router.push({
							pathname: router.pathname,
							query: {
								...router.query,
								page: +router.query.page - 1,
							},
						});
					}}
					className={`mr-3 ${
						!hasPrevPage() ? "cursor-not-allowed opacity-30" : ""
					}`}>
					<svg
						width='24'
						height='24'
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<g clipPath='url(#clip0_425_16264)'>
							<path
								d='M15 6L9 12L15 18'
								stroke='#061A14'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</g>
						<defs>
							<clipPath id='clip0_425_16264'>
								<rect width='24' height='24' fill='white' />
							</clipPath>
						</defs>
					</svg>
				</button>
				{pagPages.map((page, i) => {
					return (
						<button
							onClick={() => {
								if (page !== "...")
									router.push({
										pathname: router.pathname,
										query: {
											...router.query,
											page: page,
										},
									});
							}}
							disabled={(_page === undefined && page === "1") || _page === page}
							key={page + i}
							className={`p-3 ${
								_page === undefined && page === "1"
									? "bg-primary text-white cursor-not-allowed"
									: _page === page
									? "bg-primary text-white cursor-not-allowed"
									: "text-accent-gray"
							} w-10 h-10 rounded-[5px] flex items-center justify-center font-semibold`}>
							{page}
						</button>
					);
				})}
				<button
					disabled={!hasNextPage()}
					onClick={() => {
						router.push({
							pathname: router.pathname,
							query: {
								...router.query,
								page: +router.query.page + 1 || 2,
							},
						});
					}}
					className={`ml-3 ${
						!hasNextPage() ? "cursor-not-allowed opacity-30" : ""
					}`}>
					<svg
						width='25'
						height='24'
						viewBox='0 0 25 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<g clipPath='url(#clip0_425_16273)'>
							<path
								d='M9.375 6L15.625 12L9.375 18'
								stroke='#061A14'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</g>
						<defs>
							<clipPath id='clip0_425_16273'>
								<rect width='25' height='24' fill='white' />
							</clipPath>
						</defs>
					</svg>
				</button>
			</div>
		</section>
	);
};

export default Pagination;
