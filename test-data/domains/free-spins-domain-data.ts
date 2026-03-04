import {
	BATCH_FREE_SPINS_SUCCESS_FILE_PATH,
	BATCH_FREE_SPINS_PARTIAL_FAIL_FILE_PATH,
} from "@constants/file-paths";
import { ToastTitle } from "@enums/toast-titles";
import {
	buildSendingOutFreeSpinsBatchToastSubTitle,
	buildFreeSpinsBatchProcessedToastSubTitle,
} from "@core/helpers/asserter-helpers/text-asserters";
import { FreeSpinsAdminPage } from "@pages/admin/free-spins-admin/free-spins-admin-page";
import { FreeSpinsBatchScenario } from "test-data/interfaces/domain/free-spins-domain-interfaces";

export class FreeSpinsDomainData {
	public readonly batchScenarios: FreeSpinsBatchScenario[] = [
		{
			description: "All users receive free spins successfully",
			filePath: BATCH_FREE_SPINS_SUCCESS_FILE_PATH,
			assertions: async (page: FreeSpinsAdminPage): Promise<void> => {
				await page.assertThat().batchToastsAreDisplayed([
					{
						title: ToastTitle.SUCCESS,
						subTitle: buildFreeSpinsBatchProcessedToastSubTitle(
							19,
							1,
						),
					},
					{
						title: ToastTitle.SUCCESS,
						subTitle: buildSendingOutFreeSpinsBatchToastSubTitle(
							19,
							1,
						),
					},
				]);
			},
		},
		{
			description: "Some users fail to receive free spins",
			filePath: BATCH_FREE_SPINS_PARTIAL_FAIL_FILE_PATH,
			assertions: async (page: FreeSpinsAdminPage): Promise<void> => {
				await page.assertThat().batchToastsAreDisplayed([
					{
						title: ToastTitle.SUCCESS,
						subTitle: buildSendingOutFreeSpinsBatchToastSubTitle(
							21,
							1,
						),
					},
				]);
				await page.assertThat().batchResultsPopupIsDisplayed(19, 2);
			},
		},
	];
}
