import { Page, expect } from "@playwright/test";
import { BasePage } from "../base/base-page";
import { CrashGamePageMap } from "./crash-game-page-map";
import { CrashGamePageAsserter } from "./crash-game-page-asserter";

export class CrashGamePage extends BasePage<CrashGamePageMap> {
	public constructor(page: Page) {
		super(page, new CrashGamePageMap(page));
	}

	public override async navigate(): Promise<void> {
		await this.page.goto("/crash");
	}

	public override assertThat(): CrashGamePageAsserter {
		return new CrashGamePageAsserter(this);
	}

	public async waitBettingWindowAvailable(
		timeout: number = 90,
	): Promise<void> {
		await expect(this.map.spinningCountdownCounter).toBeAttached({
			timeout: timeout * 1000,
		});
	}

	public async waitCrash(timeout: number = 90): Promise<void> {
		await expect(this.map.multiplierCounterCrashed).toBeAttached({
			timeout: timeout * 1000,
		});
	}

	public async getCrashedMultiplier(
		waitCrashTimeout: number = 60,
	): Promise<string> {
		await this.waitCrash(waitCrashTimeout);
		return this.map.multiplierCounterCrashed.innerText();
	}

	public async placeBet(
		betAmount: number,
		autoCashoutMultiplier: number,
	): Promise<void> {
		await this.waitBettingWindowAvailable();
		await this.map.betField.fill(`${betAmount}`);
		await this.map.autoCashOutField.fill(`${autoCashoutMultiplier}`);
		await this.map.placeBetBtn.click();
	}
}
