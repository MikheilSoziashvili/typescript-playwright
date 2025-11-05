export interface PromoCampaignUpdateCsvRecord {
	promoType: string;
	initialStatus: string;
	firstAction: string;
	intermediateStatus: string;
	finalAction: string;
	finalStatus: string;
}

export type PromoCampaignUpdateCsv = PromoCampaignUpdateCsvRecord[];
