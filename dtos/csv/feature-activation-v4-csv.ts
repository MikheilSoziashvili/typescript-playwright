export interface FeatureActivationV4CsvRecord {
	userType: string;
	loginUserTag: string;
	v4BeforeLogin: string;
	v4AfterLogin: string;
}

export type FeatureActivationV4Csv = FeatureActivationV4CsvRecord[];
