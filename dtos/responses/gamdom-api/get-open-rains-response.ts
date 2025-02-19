export type RainDTO = {
	id: number;
	created: string;
	base_amount: number;
	contributed: number;
	active: boolean;
	planned: string;
	open: boolean;
	custom_name: string;
	modified_date: string;
	customRain: {
		name: string;
		frequencyMins: number;
		active: boolean;
	};
};
