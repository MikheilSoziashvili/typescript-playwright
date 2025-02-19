import { BaseMap } from "./base-map";
import { BaseModal } from "./base-modal";

export class BaseModalStep<
	T extends BaseModal<U>,
	U extends BaseMap = BaseMap,
> {
	readonly gamdomModal: T;

	public constructor(gamdomModal: T) {
		this.gamdomModal = gamdomModal;
	}
}
