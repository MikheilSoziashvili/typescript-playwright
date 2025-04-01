import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { CryptoAdminAsserter } from "./crypto-admin-page-asserter";
import { CryptoAdminMap } from "./crypto-admin-page-map";
import { CryptoAdminSteps } from "./crypto-admin-page-steps";
import { CRYPTO_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
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

	@step()
	public async refreshCryptoData(): Promise<void> {
		await this.map.refreshButton.click();
	}

	@step()
	public async clickMinDepositButton(nodeTitle: string): Promise<void> {
		await this.map.minDepositButton(nodeTitle).click();
	}

	@step()
	public async clickMinWithdrawButton(nodeTitle: string): Promise<void> {
		await this.map.minWithdrawButton(nodeTitle).click();
	}

	@step()
	public async sendQueuedWithdrawals(): Promise<void> {
		await this.navigate();
		await this.map.sendQueuedWithdrawalsButton.click();
	}
}
