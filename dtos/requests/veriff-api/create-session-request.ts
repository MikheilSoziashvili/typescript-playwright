export type CreateSessionRequest = {
	verification: {
		callback: string;
		vendorData: string;
	};
};
