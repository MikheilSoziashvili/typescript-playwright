import { BaseAsserter } from "base/base-asserter";
import { GoogleAuthPage } from "./google-auth-page";

export class GoogleAuthPageAsserter extends BaseAsserter<GoogleAuthPage> {
	public constructor(page: GoogleAuthPage) {
		super(page);
	}
}
