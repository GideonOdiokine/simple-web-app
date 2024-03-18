export const passwordValidation = (value: string, label: string = "") => {
	const messages = [];

	if (!/[A-Z]/g.test(value)) {
		messages.push("an uppercase letter");
	}
	if (!/[a-z]/g.test(value)) {
		messages.push("a lowercase letter");
	}
	if (!/[0-9]/g.test(value)) {
		messages.push("a number");
	}
	// eslint-disable-next-line no-useless-escape
	if (!/[*|\":<>[\]{}`\\()';@&$#]/g.test(value)) {
		messages.push("a special character");
	}
	if (value.length < 8) {
		messages.push("at least 8 digits");
	}

	const message =
		messages.length > 1
			? `${messages.slice(0, -1).join(", ")} and ${messages.slice(-1)}`
			: `${messages.join(", ")}`;
	// console.log(`The ${label} field must have ${message}`);
	return messages.length > 0 ? `The ${label} field must have ${message}` : true;
};
