import { Locator, expect } from "@playwright/test";
import { BaseComponent } from "./base-component";
import { BaseModal } from "./base-modal";
import { BasePage } from "./base-page";
import { waitForSeconds } from "@core/utils/utils";
import { step } from "decorators/step";

export class BaseAsserter<T extends BasePage | BaseModal | BaseComponent> {
	readonly gamdomPage: T;

	public constructor(gamdomPage: T) {
		this.gamdomPage = gamdomPage;
	}

	public async checkElementsAreVisible(
		elements: Locator[],
		timeout?: number,
	): Promise<void> {
		for (const element of elements) {
			await expect(element).toBeVisible({ timeout });
		}
	}

	public async checkElementsAreNotVisible(
		elements: Locator[],
		timeout?: number,
	): Promise<void> {
		for (const element of elements) {
			await expect(element).not.toBeVisible({ timeout });
		}
	}

	public async checkStringElementsAreEqual(
		expectedTexts: string[],
		actualTexts: string[],
	): Promise<void> {
		expect(expectedTexts.length).toBe(actualTexts.length);
		expectedTexts.forEach((expectedText, index) => {
			expect(expectedText.trim()).toBe(actualTexts[index].trim());
		});
	}

	@step()
	public async verifyCurrentUrlIs(expectedUrl: string): Promise<void> {
		await this.gamdomPage.page.waitForLoadState();
		const currentUrl = this.gamdomPage.page.url();
		expect(currentUrl).toBe(expectedUrl);
	}

	@step("New tab url is correct")
	public async verifyNewTabUrl(expectedUrl: string): Promise<void> {
		let pages = this.gamdomPage.page.context().pages();
		const timeBetweenIterations = 100;
		let attempts = 0;
		// Retry for up to 10 seconds (100 attempts with a 100ms delay each)
		while (pages.length <= 1 && attempts < timeBetweenIterations) {
			await waitForSeconds(timeBetweenIterations / 1000);
			pages = this.gamdomPage.page.context().pages();
			attempts++;
		}
		expect(pages.length).toBeGreaterThan(1);
		const newTab = pages[pages.length - 1];
		await newTab.waitForLoadState("domcontentloaded");

		const newTabUrl = newTab.url();
		expect(newTabUrl).toBe(expectedUrl);
	}
}
