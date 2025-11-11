import { Locator, expect } from "@playwright/test";
import { BaseMap } from "./base-map";
import { BaseModal } from "./base-modal";
import { step } from "decorators/step";

export class BaseModalStep<
	T extends BaseModal<U>,
	U extends BaseMap = BaseMap,
> {
	readonly gamdomModal: T;

	public constructor(gamdomModal: T) {
		this.gamdomModal = gamdomModal;
	}

	@step("Check checkbox")
	public async checkCheckbox(
		clickTarget: Locator,
		checkTarget: Locator,
		isChecked: boolean,
	): Promise<void> {
		await clickTarget.click();
		await expect(checkTarget).toBeChecked({ checked: isChecked });
	}
}
