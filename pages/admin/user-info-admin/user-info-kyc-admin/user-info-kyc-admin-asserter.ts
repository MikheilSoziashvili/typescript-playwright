import { BaseAsserter } from "@base/base-asserter";
import { UserInfoKycAdminPage } from "./user-info-kyc-admin-page";
import { step } from "decorators/step";
import { KycAdminActions, KycLevels } from "@enums/verification-enums";

export class UserInfoKycAdminPageAsserter extends BaseAsserter<UserInfoKycAdminPage> {
	public constructor(page: UserInfoKycAdminPage) {
		super(page);
	}

	@step("Verify KYC level status")
	public async kycLevelStatusIs(
		level: KycLevels,
		expectedStatus: string,
	): Promise<void> {
		const actualStatus = this.gamdomPage.map.kycLevelStatus(level);
		await this.checkElementsHaveText([
			{ locator: actualStatus, expectedText: expectedStatus },
		]);
	}

	@step("Verify KYC action button is visible")
	public async kycActionButtonIsVisible(
		level: KycLevels,
		buttonName: KycAdminActions,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.kycActionButton(level, buttonName),
		]);
	}

	@step("Verify KYC action button and status are visible")
	public async kycActionButtonAndStatusAreVisible(
		level: KycLevels,
		buttonName: KycAdminActions,
		expectedStatus: string,
	): Promise<void> {
		await this.kycActionButtonIsVisible(level, buttonName);
		await this.kycLevelStatusIs(level, expectedStatus);
	}

	@step("Verify all KYC cards and action buttons are visible")
	public async allKycCardsAndActionButtonsAreVisible(
		level: KycLevels,
		buttonName: KycAdminActions,
	): Promise<void> {
		const levels = Object.values(KycLevels);
		for (const level of levels) {
			await this.checkElementsAreVisible([
				this.gamdomPage.map.kycLevelCard(level),
			]);
		}
		await this.checkElementsAreVisible([
			this.gamdomPage.map.kycActionButton(level, buttonName),
		]);
	}
}
