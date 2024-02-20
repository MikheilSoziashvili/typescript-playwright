import { BaseModal } from "./base-modal";
import { BasePage } from "./base-page";

export class BaseAsserter<T extends BasePage | BaseModal> {
	readonly gamdomPage: T;

	public constructor(gamdomPage: T) {
		this.gamdomPage = gamdomPage;
	}
}
