export const fileUploadValidation = (value: File, label: string = "") => {
	const messages = [];

	const fileTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];

	if (value[0].size > 5000000) {
		messages.push("size must be less than 5MB");
	}

	if (!fileTypes.includes(value[0].type)) {
		messages.push("type must be either png, jpeg, jpg or pdf");
	}

	const message =
		messages.length > 1
			? `${messages.slice(0, -1).join(", ")} and ${messages.slice(-1)}`
			: `${messages.join(", ")}`;
	return messages.length > 0 ? `The ${label} ${message}` : true;
};
