import { BasePageStep } from "@pages/base/base-page-step";
import { CryptoAdminPage } from "./crypto-admin-page";

export class CryptoAdminSteps extends BasePageStep<CryptoAdminPage> {
	public constructor(page: CryptoAdminPage) {
		super(page);
	}
}
