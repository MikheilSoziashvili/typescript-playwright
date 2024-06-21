import { BaseAsserter } from "@base/base-asserter";
import { SteamAuthPage } from "./steam-auth-page";

export class SteamAuthPageAsserter extends BaseAsserter<SteamAuthPage> {
	public constructor(page: SteamAuthPage) {
		super(page);
	}
}
