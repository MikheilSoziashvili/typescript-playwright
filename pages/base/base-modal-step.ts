import { BaseModal } from "./base-modal";

export class BaseModalStep<T extends BaseModal> {
	readonly gamdomModal: T;

	public constructor(gamdomModal: T) {
		this.gamdomModal = gamdomModal;
	}
}
