import { BaseAsserter } from "@base/base-asserter";
import { SteamBlockedPage } from "./steam-blocked-page";

export class SteamBlockedPageAsserter extends BaseAsserter<SteamBlockedPage> {
	public constructor(page: SteamBlockedPage) {
		super(page);
	}
}
