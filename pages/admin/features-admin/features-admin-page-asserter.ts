import { BaseAsserter } from "@pages/base/base-asserter";
import { FeaturesAdminPage } from "./features-admin-page";

export class FeaturesAdminAsserter extends BaseAsserter<FeaturesAdminPage> {
	public constructor(page: FeaturesAdminPage) {
		super(page);
	}
}
