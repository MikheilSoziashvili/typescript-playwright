import { BaseAsserter } from "@pages/base/base-asserter";
import { KenoGamePage } from "./keno-game-page";

export class KenoGamePageAsserter extends BaseAsserter<KenoGamePage> {
	public constructor(page: KenoGamePage) {
		super(page);
	}
}
