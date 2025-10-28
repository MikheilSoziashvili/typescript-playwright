import { BulkActions } from "@enums/bulk-actions";
import { ToastTitle } from "@enums/toast-titles";

export interface VipManagerBatchUpdateTestScenario {
	userCredentials: { username: string; password: string };
	testDescriptionName: string;
	expectedBatchUpdatePresence: boolean;
	describeName: string;
}

export interface VipManagerWrongFormatFilesScenario {
	filePath: string;
	fileFormatType: string;
}

export interface VipManagerIncorrectUserIdBulkFilesScenario {
	filePath: string;
	bulkAction: BulkActions;
	expectedToasts: {
		title: ToastTitle;
		subTitle: string;
	}[];
	expectedErrorMessage: string;
	expectedSuccessToastMessage: string;
}
