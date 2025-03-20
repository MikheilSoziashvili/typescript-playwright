import { BasePageStep } from "@pages/base/base-page-step";
import { TransactionDetailsModal } from "./transaction-details-modal";

export class TransactionDetailsModalSteps extends BasePageStep<TransactionDetailsModal> {
	public constructor(page: TransactionDetailsModal) {
		super(page);
	}
}
