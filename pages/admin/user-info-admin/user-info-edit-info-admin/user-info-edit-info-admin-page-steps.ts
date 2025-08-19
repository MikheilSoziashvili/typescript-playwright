import { BasePageStep } from "@pages/base/base-page-step";
import { UserInfoEditInfoAdminPage } from "./user-info-edit-info-admin-page";
import { step } from "decorators/step";
import { BalanceEditStep } from "@dtos/test-data";
import { Page } from "@playwright/test";
import { ToastAsserter } from "@pages/components/toast/toast-asserter";
import { logger } from "@logger/logger";

export class UserInfoEditInfoAdminPageSteps extends BasePageStep<UserInfoEditInfoAdminPage> {
	public constructor(gamdomPage: UserInfoEditInfoAdminPage) {
		super(gamdomPage);
	}

	@step("Adjust value by label")
	public async adjustValueByLabel(
		label: string,
		delta: number,
	): Promise<void> {
		const input = this.gamdomPage.map.rowInputByLabel(label);
		const currentValue = parseInt(await input.inputValue(), 10);
		await input.fill(String(currentValue + delta));
	}

	@step("Run edit steps")
	public async runEditSteps(
		steps: BalanceEditStep[],
		wallet: string,
		page: Page,
		toast: ToastAsserter,
	): Promise<void> {
		for (const step of steps) {
			logger.info(`Executing step: ${step.name}`);
			await step.action(this.gamdomPage, wallet, page);
			await this.gamdomPage.clickSaveButton();
			await toast.titleIs(step.expectedTitle);
			await toast.subTitleIs(step.expectedMsg);
		}
	}
}
