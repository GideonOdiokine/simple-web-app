import Button from "@/components/global/Button";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { RegisterUserResponse } from "@/types/auth/auth";

type Props = {
	user: RegisterUserResponse;
};

const Success = ({ user }: Props) => {
	const router = useRouter();

	const goToDashboard = () => {
		if (user) {
			Cookies.set("kadavraUserDetails", JSON.stringify(user));
			Cookies.set("kadavraToken", user.token);
			router.push("/");
		}
	};

	return (
		<section>
			<div className='text-center space-y-[7px] mb-10'>
				<img
					className='mx-auto mb-7 w-[205px] md:w-auto'
					src='/assets/images/register-success.svg'
					alt=''
				/>
				<h1 className='text-center text-2xl lg:text-[32px] font-bold text-secondary'>
					Welcome on board
				</h1>
				<p className='text-accent-gray lg:text-lg leading-[29px]'>
					Get your currency delivered to your home, ready for collection at your
					nearest branch or via a Travel Money Card
				</p>
			</div>
			<form className='space-y-6'>
				<Button className='w-full' onClick={goToDashboard}>
					Go to Dashboard
				</Button>
			</form>
		</section>
	);
};

export default Success;
