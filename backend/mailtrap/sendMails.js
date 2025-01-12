import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
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
