import { LeftNavigationProps } from "@/types/layouts/LeftNavigationProps";
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "../global/Button";
import Cookies from "js-cookie";

const Navigations = ({ navigations }: LeftNavigationProps) => {
	const location = useRouter();

	const logout = () => {
		Cookies.remove("kadavraUserDetails");
		Cookies.remove("kadavraToken");
		setTimeout(() => location.push("/auth/login"), 1000);
	};

	return (
		<div className='overflow-y-auto h-[calc(100vh-120px)] pt-1 transition-all ease-in scrollbar-thin hover:scrollbar-thumb-primary hover:scrollbar-track-gray-200 scrollbar-thumb-rounded-full scrollbar-track-rounded-full'>
			{navigations.map((navigation) => (
				<div key={navigation.name} className='xl:pb-3'>
					<hr className='mb-5' />
					{navigation.name && (
						<>
							<div
								aria-label={`${navigation.name.toLowerCase()} navigation group`}
								className='mb-3 px-8 text-primary text-xs md:text-sm font-semibold'>
								{navigation.name}
							</div>
						</>
					)}
					<ul className='flex flex-col gap-[2px] px-4 pb-3 md:pb-10 xl:pb-0'>
						{navigation.links.map((item) => (
							<li
								key={item.name}
								title={item.name}
								aria-label={`link to ${item.name}`}
								className='flex items-center cursor-pointer'>
								<Link
									href={`${item.href}${item.slug ? item.slug : ""}${
										item.query ? item.query : ""
									}`}>
									<a
										target={item.target ? "item.target" : "_self"}
										className={`nav-hover ${
											item.href === "/" && location.pathname === item.href
												? "active"
												: item.href.length > 1 &&
												  location.pathname.startsWith(item.href)
												? "active"
												: ""
										} cursor-pointer flex items-center w-full p-2 md:px-4 md:py-3 gap-x-4 transition-all ease-in group-hover:text-primary text-[#FFFFFF99] group-hover:bg-[#E7F6FD] rounded-[5px]`}>
										<img
											src={`/assets/icons/layouts/${item.icon}.svg`}
											className='group-hover:invert-[25%] group-hover:sepia-[49%] group-hover:saturate-[527%] group-hover:hue-rotate-[137deg] group-hover:brightness-[93%]'
										/>
										<div className='leading-[160%] text-sm md:text-base font-medium'>
											{item.name}
										</div>
									</a>
								</Link>
							</li>
						))}
					</ul>
				</div>
			))}
			<div className='px-4 mt-6'>
				<Button
					className='w-full border border-error text-error rounded-[5px]'
					size='sm'
					theme='plain'
					onClick={logout}>
					Logout
				</Button>
			</div>
		</div>
	);
};

export default Navigations;
