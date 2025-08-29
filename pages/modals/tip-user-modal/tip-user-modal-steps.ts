import { TipUserModal } from "./tip-user-modal";
import { step } from "decorators/step";
import { BaseModalStep } from "@pages/base/base-modal-step";

export class TipUserModalSteps extends BaseModalStep<TipUserModal> {
	public constructor(page: TipUserModal) {
		super(page);
	}

	@step("Tip user")
	public async tipUser(value: number): Promise<void> {
		await this.gamdomModal.insertTipValue(value);
		await this.gamdomModal.assertThat().isValueVisible(value);
		await this.gamdomModal.tipUser(value);
	}
}
