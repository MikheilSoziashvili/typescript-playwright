import { BaseAsserter } from "@pages/base/base-asserter";
import { IpBlockAdminPage } from "./ip-block-admin-page";

export class IpBlockAdminAsserter extends BaseAsserter<IpBlockAdminPage> {
	public constructor(page: IpBlockAdminPage) {
		super(page);
	}
}
