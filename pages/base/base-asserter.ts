import { Locator, expect } from "@playwright/test";
import { BaseComponent } from "./base-component";
import { BaseModal } from "./base-modal";
import { BasePage } from "./base-page";

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
			await expect.soft(element).not.toBeVisible({ timeout });
		}
	}

	public async checkElementsAreNotVisible(
		elements: Locator[],
		timeout?: number,
	): Promise<void> {
		for (const element of elements) {
			await expect.soft(element).not.toBeVisible({ timeout });
		}
	}
}
