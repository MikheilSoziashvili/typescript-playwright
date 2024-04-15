import { Page } from "@playwright/test";
import { BaseModal } from "../../base/base-modal";
import { TipUserModalMap } from "./tip-user-modal-map";
import { TipUserModalAsserter } from "./tip-user-modal-asserter";

export class TipUserModal extends BaseModal<TipUserModalMap> {
	constructor(page: Page) {
		super(page, new TipUserModalMap(page));
	}

	public assertThat(): TipUserModalAsserter {
		return new TipUserModalAsserter(this);
	}

	public async insertTipValue(value: string): Promise<void> {
		await this.map.tipAmountField.fill(value);
	}

	public async clearTipValue(): Promise<void> {
		await this.map.clearAmountButton.click();
	}

	async tipUser(value: string): Promise<void> {
		await this.map.tipAmountField.fill(value);
		await this.map.tipButton.click();
	}
}
