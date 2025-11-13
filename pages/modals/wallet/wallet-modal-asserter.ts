import { BaseAsserter } from "@pages/base/base-asserter";
import { WalletModal } from "./wallet-modal";
import { Timeout } from "@enums/timeout";
import { expect } from "playwright/test";
import { step } from "decorators/step";
import { Unit } from "@enums/units";
import { WalletType } from "@enums/wallet-types";
import { Currency } from "@enums/currencies";

export class WalletModalAsserter extends BaseAsserter<WalletModal> {
	public constructor(page: WalletModal) {
		super(page);
	}

	@step("Vault tab heading is displayed")
	async vaultTabHeadingIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.vaultTabHeading],
			Timeout.SHORT,
		);
	}

	@step("Vault wallet amount is")
	public async vaultWalletAmountIs(
		expectedUsd: number,
		unit: Unit,
	): Promise<void> {
		const backendUsd =
			await this.userBalanceHandler.walletBalanceInFiatRounded(
				unit,
				Currency.USD,
				WalletType.VAULT,
			);

		expect(backendUsd).toBeCloseTo(expectedUsd, 1);
	}

	@step("Vault deposit toast message is displayed")
	public async vaultDepositToastMessageIsDisplayed(
		amount: string,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.vaultDepositToastMessage,
		).toContainText(
			`${amount} has been transferred from your Wallet to your Vault`,
		);
	}

	@step("Vault withdraw toast message is displayed")
	public async vaultWithdrawToastMessageIsDisplayed(
		amount: string,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.vaultWithdrawToastMessage,
		).toContainText(
			`${amount} has been transferred from your Vault to your Wallet`,
		);
	}

	@step("Verify deposit Disabled text is displayed")
	public async verifyDepositDisabledTextIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.depositDisabledText,
		]);
	}

	@step("Verify KYC Level One container is visible")
	public async kycLevelOneContainerIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.kycLevelOneCotainer,
		]);
	}

	@step("Verify deposit address input field is visible")
	public async depositAddressInputFieldIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.bitcoinAddressInput,
		]);
	}

	@step("Verify that Veriff iFrame is visible")
	public async verifyThatVeriffIFrameIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.veriffIFrameElement,
		]);
	}

	@step("KYC Level Two Verification title is visible")
	public async kycLevelTwoVerificationTitleIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.kycLevelTwoHeader,
		]);
	}

	@step("KYC Level Three Verification header is visible")
	public async kycLevelThreeVerificationHeaderIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.kycLevelThreeHeader,
		]);
	}
}
