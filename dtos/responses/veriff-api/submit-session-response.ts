export type SubmitSessionResponse = {
	status: string;
	verification: {
		id: string;
		url: string;
		vendorData: string;
		host: string;
		status: string;
		sessionToken: string;
	};
};
