import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { CryptoAdminAsserter } from "./crypto-admin-page-asserter";
import { CryptoAdminMap } from "./crypto-admin-page-map";
import { CryptoAdminSteps } from "./crypto-admin-page-steps";
import { CRYPTO_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import {
	BasePageNavigationParametersType,
	CryptoOperationOptions,
} from "@core/types/types";
import { step } from "decorators/step";

export class CryptoAdminPage extends BasePage<CryptoAdminMap> {
	public constructor(page: Page) {
		super(page, new CryptoAdminMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [CRYPTO_ADMIN_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): CryptoAdminAsserter {
		return new CryptoAdminAsserter(this);
	}

	public steps(): CryptoAdminSteps {
		return new CryptoAdminSteps(this);
	}

	@step("Refresh crypto data")
	public async refreshCryptoData(): Promise<void> {
		await this.map.refreshButton.click();
	}

	@step("Click min deposit button")
	public async clickMinDepositButton(
		nodeTitle: string,
		currency?: string,
	): Promise<void> {
		await this.map.minDepositButton(nodeTitle, currency).click();
	}

	@step("Click min withdraw button")
	public async clickMinWithdrawButton(
		nodeTitle: string,
		currency?: string,
	): Promise<void> {
		await this.map.minWithdrawButton(nodeTitle, currency).click();
	}

	@step("Send queued withdrawals")
	public async sendQueuedWithdrawals(): Promise<void> {
		await this.navigate();
		await this.map.sendQueuedWithdrawalsButton.click();
	}

	@step("Toggle crypto operations")
	public async toggleCryptoOperations(
		operations: CryptoOperationOptions[],
	): Promise<void> {
		for (const { cryptoName, deposit, withdraw } of operations) {
			const toggles = [
				{
					desiredState: deposit,
					locator: this.map.depositToggle(cryptoName),
				},
				{
					desiredState: withdraw,
					locator: this.map.withdrawToggle(cryptoName),
				},
			];

			for (const { desiredState, locator } of toggles) {
				if (typeof desiredState === "boolean") {
					const isChecked = await locator.isChecked();
					if (isChecked !== desiredState) {
						this.page.once("dialog", async (dialog) => {
							await dialog.accept();
						});
						await locator.click();
					}
				}
			}
		}
	}
}
