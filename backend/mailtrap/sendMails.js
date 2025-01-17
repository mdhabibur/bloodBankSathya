import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendUserVerificationEmail = async (
	recipientsEmail,
	verificationCode
) => {
	const recipients = [
		{
			email: recipientsEmail,
		},
	];

	mailtrapClient
		.send({
			from: sender,
			to: recipients,
			subject: "please verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace(
				"{verificationCode}",
				verificationCode
			),
			category: "User Email Verification Blood_Bank_Udemy",
		})
		.then(console.log, console.error);
};


export const sendResetPasswordEmail = async (
	recipientsEmail,
	resetUrl
) => {
	const recipients = [
		{
			email: recipientsEmail,
		},
	];

	mailtrapClient
		.send({
			from: sender,
			to: recipients,
			subject: "Reset your password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
				"{resetURL}",
				resetUrl	
			),
			category: "User Reset Password Blood_Bank_Udemy",
		})
		.then(console.log, console.error);
};


export const sendResetPasswordSuccessfulEmail = async (
	recipientsEmail
) => {
	const recipients = [
		{
			email: recipientsEmail,
		},
	];

	mailtrapClient
		.send({
			from: sender,
			to: recipients,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "User Password Reset Successful Blood_Bank_Udemy",
		})
		.then(console.log, console.error);
};
