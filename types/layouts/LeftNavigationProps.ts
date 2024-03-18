export type LeftNavigationProps = {
	navigations: {
		name: string;
		links: {
			name: string;
			href: string | null;
			icon: string;
			query?: string;
			slug?: string;
			target?: string;
		}[];
	}[];
};
