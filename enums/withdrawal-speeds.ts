export enum WithdrawalSpeed {
	Standard = "Standard",
	Fast = "Fast",
	Turbo = "Turbo",
}

export enum FeeLevel {
	LOW = "LOW",
	MEDIUM = "MEDIUM",
	HIGH = "HIGH",
}

export const withdrawalSpeedToFeeLevel: Record<WithdrawalSpeed, FeeLevel> = {
	[WithdrawalSpeed.Standard]: FeeLevel.LOW,
	[WithdrawalSpeed.Fast]: FeeLevel.MEDIUM,
	[WithdrawalSpeed.Turbo]: FeeLevel.HIGH,
};
