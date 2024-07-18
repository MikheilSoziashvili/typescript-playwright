export type RegisterRequest = {
	username: string;
	password: string;
	email: string;
	email_consent_checked: boolean;
	captcha_solution: string;
	totp_token: string;
};
