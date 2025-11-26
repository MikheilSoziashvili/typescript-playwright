import { BalanceEditStep } from "@dtos/test-data";
import { logger } from "@logger/logger";
import { BasePageStep } from "@pages/base/base-page-step";
import { ToastAsserter } from "@pages/components/toast/toast-asserter";
import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { UserInfoEditInfoAdminPage } from "./user-info-edit-info-admin-page";

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
			await toast.isNotDisplayed();
		}
	}

	@step("Select eSports category option")
	public async selectEsportsCategory(category: string): Promise<void> {
		await this.gamdomPage.map.esportsCategoryCombobox.click();
		await this.gamdomPage.map.esportsCategoryOption(category).click();
	}

	@step("Save eSports category and get toast message")
	public async saveEsportsCategoryAndGetToastMessage(): Promise<string> {
		await this.gamdomPage.clickSaveButton();
		const toastMessage = await this.gamdomPage.toast.getToastMessage();
		return toastMessage;
	}

	@step("Select and save esports category, then get toast message")
	public async selectAndSaveEsportsCategoryAndGetToastMessage(
		category: string,
	): Promise<string> {
		await this.selectEsportsCategory(category);
		return this.saveEsportsCategoryAndGetToastMessage();
	}
}
