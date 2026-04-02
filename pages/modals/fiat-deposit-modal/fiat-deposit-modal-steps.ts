import { BasePageStep } from "@pages/base/base-page-step";
import { FiatDepositModal } from "./fiat-deposit-modal";

export class FiatDepositModalSteps extends BasePageStep<FiatDepositModal> {
	public constructor(page: FiatDepositModal) {
		super(page);
	}
}
