export const requiredFieldRule = (message) => ({
	required: true,
	message,
});

export const emailValidationRule = (message) => ({
	type: "email",
	message,
});

export const urlValidationRule = (message) => ({
	type: "url",
	message,
});
