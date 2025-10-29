import { ToastTitle } from "@enums/toast-titles";
import { FreeSpinsAdminPage } from "@pages/admin/free-spins-admin/free-spins-admin-page";

export interface FreeSpinsBatchScenario {
	description: string;
	filePath: string;
	expectedToasts?: { title: ToastTitle; subTitle: string }[];
	expectedPopupResult?: { success: number; failed: number };
	assertions: (page: FreeSpinsAdminPage) => Promise<void>;
}
