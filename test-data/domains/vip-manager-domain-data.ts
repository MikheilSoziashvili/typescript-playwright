import {
	SUPER_ADMIN_VIP_MANAGER_BULK,
	SUPER_ADMIN_VIP_MANAGER_NO_BULK,
} from "@constants/credentials";
import { TEST_FILES_DIR } from "@constants/file-paths";
import { parse_csv } from "@core/utils/utils";
import { BulkActions } from "@enums/bulk-actions";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { VipManagerDynamicErrorMessages } from "database/constants/vip-manager-errors-dynamic";
import {
	VipManagerBatchUpdateTestScenario,
	VipManagerIncorrectUserIdBulkFilesScenario,
	VipManagerWrongFormatFilesScenario,
} from "test-data/interfaces/domain";

export class VipManagerDomainData {
	public readonly wrongFileFormats = ["txt", "pdf"];

	/**
	 * Predefined scenarios describing expected UI behavior for different
	 * admin user roles with or without the `VipManagerBulkAdmin` tag.
	 *
	 * Used to verify the presence or absence of the "Batch update VIP player status"
	 * feature depending on user permissions.
	 */
	public readonly batchUpdateScenarios: VipManagerBatchUpdateTestScenario[] =
		[
			{
				userCredentials: SUPER_ADMIN_VIP_MANAGER_NO_BULK,
				testDescriptionName: `[ENG-2330] Batch update VIP player status is absent for admin user with NO 'VipManagerBulkAdmin' tag assigned`,
				expectedBatchUpdatePresence: false,
				describeName: `Vip manager no bulk admin tests`,
			},
			{
				userCredentials: SUPER_ADMIN_VIP_MANAGER_BULK,
				testDescriptionName: `[ENG-2685] Batch update VIP player status is present for admin user with 'VipManagerBulkAdmin' tag assigned`,
				expectedBatchUpdatePresence: true,
				describeName: `Vip manager with bulk admin tests`,
			},
		];

	/**
	 * Dynamically builds test scenarios for files with invalid formats
	 * (e.g. `.txt`, `.pdf`), verifying that such uploads are rejected.
	 *
	 * @returns An array of {@link VipManagerWrongFormatFilesScenario} objects,
	 * each containing the file path and format type for testing.
	 */
	public get wrongFormatFilesScenarios(): VipManagerWrongFormatFilesScenario[] {
		return this.wrongFileFormats.map((format) => ({
			filePath: `./test-files/ENG-2366-vip-manager-${format}-wrong-file-format.${format}`,
			fileFormatType: format,
		}));
	}

	/**
	 * Generates test scenarios for `.csv` files containing incorrect user IDs.
	 *
	 * Each scenario maps to a bulk upload or removal action, automatically
	 * reading the user ID from a CSV file and constructing the expected
	 * system and success toast messages for validation.
	 *
	 * @returns An array of {@link VipManagerIncorrectUserIdBulkFilesScenario}
	 * representing both upload and remove bulk action cases.
	 */
	public get incorrectUserIdBulkFilesScenarios(): VipManagerIncorrectUserIdBulkFilesScenario[] {
		const bulkActions: BulkActions[] = [
			BulkActions.UPLOAD,
			BulkActions.REMOVE,
		];

		return bulkActions.map((bulkAction) => {
			const filename = `ENG-2332-batch-vip-status-incorrect-userId-${bulkAction}.csv`;
			const filePath = `./test-files/${filename}`;

			const incorrectUserIdFromCsv = parse_csv(TEST_FILES_DIR, filename, {
				columns: false,
			}) as string[];

			const expectedErrorMessage =
				bulkAction === BulkActions.UPLOAD
					? VipManagerDynamicErrorMessages.FAILED_TO_UPDATE_VIP_STATUS(
							incorrectUserIdFromCsv[1][0],
					  )
					: VipManagerDynamicErrorMessages.FAILED_TO_REMOVE_VIP_STATUS(
							incorrectUserIdFromCsv[1][0],
					  );

			const expectedSuccessToastMessage =
				bulkAction === BulkActions.UPLOAD
					? ToastSubTitle.SUCCESSFULLY_ATTACHED
					: ToastSubTitle.SUCCESSFULLY_REMOVED_VIP_STATUSES;

			return {
				bulkAction: bulkAction,
				filePath: filePath,
				expectedSuccessToastMessage: expectedSuccessToastMessage,
				expectedErrorMessage: expectedErrorMessage,
				expectedToasts: [
					{
						title: ToastTitle.SYSTEM,
						subTitle: "Free spins batch processed with errors (0)",
					},
					{
						title: ToastTitle.SUCCESS,
						subTitle: expectedSuccessToastMessage,
					},
				],
			};
		});
	}

	/**
	 * Retrieves a batch update scenario by access level.
	 *
	 * This helper allows test logic to easily select the correct scenario
	 * based on whether the user has bulk admin privileges.
	 *
	 * @param hasBulkAdmin - Indicates if the current test user has
	 * the `VipManagerBulkAdmin` role assigned.
	 * @returns The matching {@link VipManagerBatchUpdateTestScenario},
	 * or `undefined` if no scenario matches.
	 */
	public getScenarioByAccess(
		hasBulkAdmin: boolean,
	): VipManagerBatchUpdateTestScenario | undefined {
		return this.batchUpdateScenarios.find(
			(s) => s.expectedBatchUpdatePresence === hasBulkAdmin,
		);
	}
}
