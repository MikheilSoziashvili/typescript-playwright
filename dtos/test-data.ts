import { faker } from "@faker-js/faker";
import { HiloBetOption } from "@enums/hilo-bet-options";
import { HiloBetMultiplierByBetOption } from "@enums/original-games";

export class RegisterTestData {
	#username: string;
	#password: string;
	#email: string;

	constructor() {
		this.#username = faker.internet.userName().replace(/[^A-Za-z0-9]/g, "");
		this.#password = faker.internet.password({
			length: 15,
			pattern: new RegExp("[A-Za-z0-9!@#$%^]+"),
		});
		this.#email = faker.internet.email();
	}

	get username(): string {
		return this.#username;
	}

	get password(): string {
		return this.#password;
	}

	get email(): string {
		return this.#email;
	}
}

export class BetTestData {
	public username: string;
	public betAmount: number;
	public autoCashoutMultiplier: number;

	constructor(
		username: string,
		betAmount: number,
		autoCashoutMultiplier: number,
	) {
		this.username = username;
		this.betAmount = betAmount;
		this.autoCashoutMultiplier = autoCashoutMultiplier;
	}
}

export class DiceBetTestData {
	public betAmount: number;
	public multiplier?: number;
	public rollOver?: number;
	public winChance?: number;

	constructor(
		betAmount: number,
		multiplier?: number,
		rollOver?: number,
		winChance?: number,
	) {
		this.betAmount = betAmount;
		this.multiplier = multiplier;
		this.rollOver = rollOver;
		this.winChance = winChance;
	}
}

export class HiloBetTestData {
	public username: string;
	public betAmount: number;
	public betOption: HiloBetOption;
	public betMultiplierByBetOption: HiloBetMultiplierByBetOption;

	constructor(
		username: string,
		betAmount: number,
		betOption: HiloBetOption,
		betMultiplierByBetOption: HiloBetMultiplierByBetOption,
	) {
		this.username = username;
		this.betAmount = betAmount;
		this.betOption = betOption;
		this.betMultiplierByBetOption = betMultiplierByBetOption;
	}
}
