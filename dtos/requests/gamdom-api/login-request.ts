export type LoginRequest = {
	username: string;
	password?: string;
	captcha_solution: string;
	fingerprint: string;
	totp_token: string;
};
