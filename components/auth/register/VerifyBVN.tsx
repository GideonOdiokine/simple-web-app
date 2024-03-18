import Button from "@/components/global/Button";
import Input from "@/components/global/Input";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useVerifyBVNMutation } from "src/services/auth";
import moment from "moment";
import { VerifyBVNRequest } from "@/types/auth/auth";

export interface VerifyBVNData {
	bvn: string;
	bvnPhone: string;
	dateOfBirth: string;
	email: string;
	phone: string;
}

type VerifyBVNProps = {
	getLoading?: (val: boolean) => void;
};

const VerifyBVN = ({ getLoading }: VerifyBVNProps) => {
	const [registrationId, setRegistrationId] = useState("");
	const [showBVNResult, setShowBVNResult] = useState(false);
	const [bvnResult, setBvnResult] = useState(null);

	const router = useRouter();

	const {
		formState: { errors, isValid },
		handleSubmit,
		control,
		watch,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			bvn: "",
			bvnPhone: "",
			dateOfBirth: "",
			phone: "",
			email: "",
		},
	});

	const bvn = watch("bvn");
	const bvnPhone = watch("bvnPhone");
	const dateOfBirth = watch("dateOfBirth");

	console.log(dateOfBirth);

	useEffect(() => {
		if (
			bvn.length === 11 &&
			bvnPhone.length >= 11 &&
			bvnPhone.length <= 14 &&
			dateOfBirth !== ""
		) {
			verifyBVN({
				bvn: bvn,
				bvnPhone: bvnPhone,
				dateOfBirth: dateOfBirth,
			});
		}
	}, [errors, bvn, bvnPhone, dateOfBirth]);

	const verifyBVN = async (data: VerifyBVNRequest) => {
		try {
			const response = await verify({
				...data,
				dateOfBirth: moment(data.dateOfBirth).format("YYYY-MM-DD"),
				bvnPhone: data.bvnPhone.startsWith("0")
					? `234${data.bvnPhone.slice(1)}`
					: data.bvnPhone.replace(/[+]/g, ""),
			}).unwrap();
			toast.success("BVN verified successfully");
			setRegistrationId(response.data.registrationId);
			setBvnResult(response.data);
			setShowBVNResult(true);
		} catch (err) {
			toast.error(err?.data?.responseDescription);
		}
	};

	const [verify, { isLoading }] = useVerifyBVNMutation();

	const onSubmit: SubmitHandler<VerifyBVNData> = async (data) => {
		router.push({
			pathname: router.pathname,
			query: {
				...router.query,
				step: "verify-phone",
				id: registrationId,
				bvn: data.bvn,
				email: data.email,
				phone: data.phone.startsWith("0")
					? `234${data.phone.slice(1)}`
					: data.phone.replace(/[+]/g, ""),
			},
		});
	};

	useEffect(() => {
		getLoading(isLoading);
	}, [isLoading]);

	return (
		<section>
			<div className='text-center space-y-[7px]'>
				<h1 className='text-center text-2xl lg:text-[32px] font-bold text-secondary'>
					Welcome to Kadavra
				</h1>
				<p className='text-accent-gray lg:text-lg leading-[29px]'>
					Let us get to know you better!
				</p>
			</div>
			<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
				<Controller
					name='bvn'
					control={control}
					rules={{
						required: "BVN is required",
						maxLength: {
							value: 11,
							message: "BVN must be 11 digits",
						},
						minLength: {
							value: 11,
							message: "BVN must be 11 digits",
						},
					}}
					render={({ field: { onChange, value } }) => (
						<Input
							onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
							value={value}
							errors={[errors?.bvn?.message]}
							focused={true}
							label='BVN'
							id='bvn'
							placeholder='Your BVN'
							loading={isLoading}
							required
						/>
					)}
				/>
				{showBVNResult && !isLoading && (
					<article className='p-4 bg-[#0EA5791A] rounded-xl'>
						<div className='text-accent-gray mb-[3px]'>
							First name:{" "}
							<span className='text-secondary text-lg font-medium'>
								{bvnResult.bvnData.firstName}
							</span>
						</div>
						{bvnResult?.bvnData?.middleName && (
							<div className='text-accent-gray mb-[3px]'>
								Middle name:{" "}
								<span className='text-secondary text-lg font-medium'>
									{bvnResult?.bvnData?.middleName}
								</span>
							</div>
						)}
						<div className='text-accent-gray mb-[3px]'>
							Last name:{" "}
							<span className='text-secondary text-lg font-medium'>
								{bvnResult.bvnData.lastName}
							</span>
						</div>
						<div className='text-accent-gray mb-3'>
							Date of birth:{" "}
							<span className='text-secondary text-lg font-medium'>
								{moment(bvnResult.bvnData.dob).format("MMM DD, YYYY")}
							</span>
						</div>
						<p className='text-sm text-error'>
							If this information is not yours kindly enter the correct BVN
							number, date of birth and phone number.
						</p>
					</article>
				)}
				<Controller
					name='bvnPhone'
					control={control}
					rules={{
						required: "BVN phone number is required",
					}}
					render={({ field: { onChange, value } }) => (
						<Input
							label='BVN Phone number'
							id='bvnPhone'
							type='tel'
							placeholder='Your BVN Phone Number'
							onChange={(e) =>
								onChange(e.target.value.replace(/[^0-9.+]/g, ""))
							}
							value={value}
							errors={[errors?.bvnPhone?.message]}
							focused={true}
							required
						/>
					)}
				/>
				<Controller
					name='dateOfBirth'
					control={control}
					rules={{
						required: "Date of birth is required",
					}}
					render={({ field: { onChange, value } }) => (
						<Input
							onChange={onChange}
							value={value}
							errors={[errors?.dateOfBirth?.message]}
							label='Date of birth'
							id='dateOfBirth'
							type='date'
							placeholder='Select Date'
							required
						/>
					)}
				/>
				<Controller
					name='phone'
					control={control}
					rules={{
						required: "phone number is required",
					}}
					render={({ field: { onChange, value } }) => (
						<Input
							label='Phone number'
							id='phone'
							type='tel'
							placeholder='Your Phone Number'
							onChange={(e) =>
								onChange(e.target.value.replace(/[^0-9.+]/g, ""))
							}
							value={value}
							errors={[errors?.phone?.message]}
							required
						/>
					)}
				/>
				<Controller
					name='email'
					control={control}
					rules={{
						required: "email is required",
						pattern: {
							value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
							message: "Invalid email address",
						},
					}}
					render={({ field: { onChange, value } }) => (
						<Input
							onChange={onChange}
							value={value}
							errors={[errors?.email?.message]}
							label='Email'
							type='email'
							id='email'
							placeholder='Your Email'
							required
						/>
					)}
				/>
				<br />
				<Button className='w-full' type='submit' disabled={!isValid}>
					Submit
				</Button>
				<div className='text-center md:text-left'>
					Already have an account?{" "}
					<Button tag='a' href='/auth/login' className='text-primary font-bold'>
						Login
					</Button>
				</div>
			</form>
		</section>
	);
};

export default VerifyBVN;
