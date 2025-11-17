import { BaseAsserter } from "@pages/base/base-asserter";
import { Datepicker } from "./datepicker";

export class DatepickerAsserter extends BaseAsserter<Datepicker> {
	public constructor(datepicker: Datepicker) {
		super(datepicker);
	}
}
