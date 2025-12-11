import { WithdrawalSpeed } from "@enums/withdrawal-speeds";

export class CryptoWithdrawalDomainData {
	public readonly withdrawalSpeeds = [
		WithdrawalSpeed.Standard,
		WithdrawalSpeed.Fast,
		WithdrawalSpeed.Turbo,
	];
}
