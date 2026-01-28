import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { CryptoAdminAsserter } from "./crypto-admin-page-asserter";
import { CryptoAdminMap } from "./crypto-admin-page-map";
import { CryptoAdminSteps } from "./crypto-admin-page-steps";
import { CRYPTO_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import {
	BasePageNavigationParametersType,
	CryptoOperationOptions,
	CustomFeesOptions,
	SetUserPayWdOptions,
} from "@core/types/types";
import { step } from "decorators/step";
import { Cryptocurrency, CryptoTicker } from "@enums/cryptocurrencies";
import { parseBalance } from "@core/utils/utils";

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
	public async clickMinDepositButton(nodeTitle: string): Promise<void> {
		await this.map.minDepositButton(nodeTitle).click();
	}

	@step("Click min withdraw button")
	public async clickMinWithdrawButton(nodeTitle: string): Promise<void> {
		await this.map.minWithdrawButton(nodeTitle).click();
	}

	@step("Click max deposit button")
	public async clickMaxDepositButton(nodeTitle: string): Promise<void> {
		await this.map.maxDepositButton(nodeTitle).click();
	}

	@step("Click max withdraw button")
	public async clickMaxWithdrawButton(nodeTitle: string): Promise<void> {
		await this.map.maxWithdrawButton(nodeTitle).click();
	}

	@step("Send queued withdrawals")
	public async sendQueuedWithdrawals(): Promise<void> {
		await this.navigate();
		await this.map.sendQueuedWithdrawalsButton.click();
	}

	@step("Enable all crypto operations")
	public async enableAllCryptoOperations(): Promise<void> {
		const cryptoList = [
			Cryptocurrency.Bitcoin,
			Cryptocurrency.Litecoin,
			Cryptocurrency.Ethereum,
			CryptoTicker.USDT,
			CryptoTicker.USDC_ETH,
			CryptoTicker.USDT_TRON,
			Cryptocurrency.Tron,
			Cryptocurrency.Ripple,
			Cryptocurrency.Doge,
			Cryptocurrency.Solana,
			CryptoTicker.USDC_SOL,
		];

		const cryptoConfig = cryptoList.map((crypto) => ({
			cryptoName: crypto,
			deposit: true,
			withdraw: true,
		}));

		await this.toggleCryptoOperations(cryptoConfig);
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

	@step("Set user pay withdrawals")
	public async setUserPayWd(
		nodeTitle: string,
		{ enabled, customFees }: SetUserPayWdOptions,
	): Promise<void> {
		const checkbox = this.map.userPayWdCheckbox(nodeTitle);
		const isChecked = await checkbox.isChecked();

		if (isChecked !== enabled) {
			await checkbox.click();
		}

		const customWdFeeToggle = this.map.customWdFeeToggle(nodeTitle);
		const isCustomWdFeeChecked = await customWdFeeToggle.isChecked();

		if (customFees && !isCustomWdFeeChecked) {
			await this.setCustomFees(nodeTitle, customFees);
		} else if (!customFees && isCustomWdFeeChecked) {
			await customWdFeeToggle.click();
		}

		await this.map.feeLevelDropdown(nodeTitle).click();
		await this.map.selectLowestFeeLevelOption.click();
		this.acceptDialog();
		await this.map.saveButton(nodeTitle).click();
	}

	@step("Get USD amount by crypto ticker")
	public async getUsdAmountByCryptoTicker(
		cryptoTicker: CryptoTicker,
	): Promise<number> {
		const amountLocator = this.map.amountUsdByCryptoCurrency(cryptoTicker);
		const amountText = (await amountLocator.textContent()) ?? "";
		return parseBalance(amountText);
	}

	@step("Set custom fees")
	private async setCustomFees(
		nodeTitle: string,
		options: CustomFeesOptions,
	): Promise<void> {
		await this.map.customWdFeeToggle(nodeTitle).click();

		const feeInputs = {
			lowFee: (node: string) => this.map.customFeeLowInput(node),
			midFee: (node: string) => this.map.customFeeMidInput(node),
			highFee: (node: string) => this.map.customFeeHighInput(node),
		};

		for (const [key, locator] of Object.entries(feeInputs)) {
			const value = options[key as keyof CustomFeesOptions];
			if (value !== undefined) {
				await locator(nodeTitle).fill(String(value));
			}
		}
	}
}
