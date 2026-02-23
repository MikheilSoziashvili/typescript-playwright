import { TestInfo } from "@playwright/test";
import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserSessionManager } from "@core/browser-session-mngmt";
import { CryptoAdminPage } from "@pages/admin/crypto-admin/crypto-admin-page";
import { CryptoOperationOptions, CustomFeesOptions } from "@core/types/types";
import { CryptoNode } from "@enums/crypto-nodes";
import { TestUserRole } from "@enums/test-user-roles";

export class CryptoAdminSetupTestFlow extends BaseTestFlow {
	constructor(
		private readonly browserSessionManager: BrowserSessionManager,
		private readonly cryptoAdminPage: CryptoAdminPage,
	) {
		super();
	}

	@testFlow("Setup crypto admin operations")
	public async setupCryptoOperations(params: {
		testInfo: TestInfo;
		operations: CryptoOperationOptions[];
		nodes: CryptoNode[];
		customFees?: Partial<Record<CryptoNode, CustomFeesOptions>>;
	}): Promise<void> {
		const { testInfo, operations, nodes, customFees } = params;

		await this.browserSessionManager.loginAs(TestUserRole.SUPERADMIN, {
			reuseContext: true,
		});

		await this.cryptoAdminPage.navigate();
		await this.cryptoAdminPage.toggleCryptoOperations(operations);
		await this.cryptoAdminPage.refreshCryptoData();
		await this.cryptoAdminPage
			.steps()
			.waitUntilCryptoDataRefreshed(testInfo);

		for (const node of nodes) {
			await this.cryptoAdminPage.setUserPayWd(node, {
				enabled: true,
				...(customFees?.[node] && { customFees: customFees[node] }),
			});

			await this.cryptoAdminPage.refreshCryptoData();
			await this.cryptoAdminPage
				.steps()
				.waitUntilCryptoDataRefreshed(testInfo);

			await this.cryptoAdminPage.steps().setMinDepositAndWithdraw(node);
		}
	}
}
