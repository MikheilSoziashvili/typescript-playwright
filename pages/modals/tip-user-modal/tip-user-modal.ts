import { Page } from "@playwright/test";
import { BaseModal } from "@base/base-modal";
import { TipUserModalMap } from "./tip-user-modal-map";
import { TipUserModalAsserter } from "./tip-user-modal-asserter";
import { parseToFloat } from "@core/utils/utils";
import { step } from "decorators/step";
import { TipUserModalSteps } from "./tip-user-modal-steps";

export class TipUserModal extends BaseModal<TipUserModalMap> {
	constructor(page: Page) {
		super(page, new TipUserModalMap(page));
	}

	public assertThat(): TipUserModalAsserter {
		return new TipUserModalAsserter(this);
	}

	public steps(): TipUserModalSteps {
		return new TipUserModalSteps(this);
	}

	@step("Insert tip value")
	public async insertTipValue(value: number): Promise<void> {
		await this.map.tipAmountField.fill(parseToFloat(value));
	}

	@step("Clear tip value")
	public async clearTipValue(): Promise<void> {
		await this.map.clearAmountButton.click();
	}

	@step("Tip user")
	async tipUser(value: number): Promise<void> {
		await this.map.tipAmountField.fill(parseToFloat(value));
		await this.map.tipButton.click();
	}
}
