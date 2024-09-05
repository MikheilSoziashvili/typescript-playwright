export type LoginRequest = {
	username: string;
	password?: string;
	captcha_solution: string;
	totp_token: string;
};
