import { BaseAsserter } from "@base/base-asserter";
import { SettingsPage } from "./settings-page";

export class SettingsPageAsserter extends BaseAsserter<SettingsPage> {
	public constructor(page: SettingsPage) {
		super(page);
	}
}
