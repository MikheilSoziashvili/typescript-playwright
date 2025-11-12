export type UploadMediaResponse = {
	status: string;
	image: {
		id: string;
		name: string;
		context: string;
		timestamp: string | null;
		size: number;
		mimetype: string;
		sessionId: string;
		url: string;
	};
};
