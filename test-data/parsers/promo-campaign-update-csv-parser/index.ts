import { PromoCampaignStatusActions } from "@enums/campaign-actions";
import { PromoCampaignStatuses } from "@enums/campaign-statuses";
import { PromoCampaignUpdateCsvRecord } from "@dtos/csv/promo-campaign-update-csv";

export interface PromoCampaignUpdateCsvParsedRecord {
	promoType: string;
	initialStatus: string;
	firstAction: PromoCampaignStatusActions;
	intermediateStatus: PromoCampaignStatuses;
	finalAction: PromoCampaignStatusActions;
	finalStatus: PromoCampaignStatuses;
}

export const parsePromoCampaignUpdateCsvRecord = (
	row: PromoCampaignUpdateCsvRecord,
): PromoCampaignUpdateCsvParsedRecord => ({
	promoType: row.promoType,
	initialStatus: row.initialStatus,
	firstAction: row.firstAction as PromoCampaignStatusActions,
	intermediateStatus: row.intermediateStatus as PromoCampaignStatuses,
	finalAction: row.finalAction as PromoCampaignStatusActions,
	finalStatus: row.finalStatus as PromoCampaignStatuses,
});
