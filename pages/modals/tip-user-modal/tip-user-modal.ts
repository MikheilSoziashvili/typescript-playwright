import { Page } from "@playwright/test";
import { BaseModal } from "@base/base-modal";
import { TipUserModalMap } from "./tip-user-modal-map";
import { TipUserModalAsserter } from "./tip-user-modal-asserter";
import { parseToFloat } from "@core/utils";

export class TipUserModal extends BaseModal<TipUserModalMap> {
	constructor(page: Page) {
		super(page, new TipUserModalMap(page));
	}

	public assertThat(): TipUserModalAsserter {
		return new TipUserModalAsserter(this);
	}

	public async insertTipValue(value: number): Promise<void> {
		await this.map.tipAmountField.fill(parseToFloat(value));
	}

	public async clearTipValue(): Promise<void> {
		await this.map.clearAmountButton.click();
	}

	async tipUser(value: number): Promise<void> {
		await this.map.tipAmountField.fill(parseToFloat(value));
		await this.map.tipButton.click();
	}
}
