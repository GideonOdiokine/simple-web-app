type StatusPillProps = {
	status: "Pending" | "Sucesss" | "Cancelled" | "Incomplete" | any;
};

const StatusPill = ({ status }: StatusPillProps) => {
	const statusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "pending":
				return "bg-[#D4AF0F1A] text-[#D4AF0F]";
			case "incomplete":
				return "bg-[#D4AF0F1A] text-[#D4AF0F]";
			case "success":
				return "bg-[#1EB53A1A] text-[#1EB53A]";
			case "completed":
				return "bg-[#1EB53A1A] text-[#1EB53A]";
			case "cancelled":
				return "bg-[#CE11261A] text-[#CE1126]";
			case "failed":
				return "bg-[#CE11261A] text-[#CE1126]";
			case "coming soon":
				return "bg-primary text-white";
			default:
				return "bg-[#00000015] text-[#5A5C5C]";
		}
	};

	return (
		<div
			className={`${statusColor(
				status
			)} w-fit py-1 px-4 rounded-xl text-sm font-bold capitalize`}>
			{status.toLowerCase()}
		</div>
	);
};

export default StatusPill;
