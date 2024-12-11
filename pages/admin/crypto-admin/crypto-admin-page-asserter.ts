import { BaseAsserter } from "@pages/base/base-asserter";
import { CryptoAdminPage } from "./crypto-admin-page";

export class CryptoAdminAsserter extends BaseAsserter<CryptoAdminPage> {
	public constructor(page: CryptoAdminPage) {
		super(page);
	}
}
