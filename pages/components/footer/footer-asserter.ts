import { BaseAsserter } from "@base/base-asserter";
import { Footer } from "./footer";

export class FooterAsserter extends BaseAsserter<Footer> {
	public constructor(footer: Footer) {
		super(footer);
	}
}
