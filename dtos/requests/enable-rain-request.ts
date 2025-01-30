export type EnableRainRequest = {
	type: string;
	arg: {
		announcementDate: string;
		customData: {
			active: boolean;
			extraAmount: number;
			frequencyMins: number;
			maxAmount: number;
			minAmount: number;
			name: string;
			percentExtraAmount: number;
		};
		type: string;
	};
};
