import { GAMDOM_EMAIL_DOMAIN } from "@constants/domains";
import { RegisterTestDataParams } from "@core/interfaces";
import { HiloBetOption } from "@enums/hilo-bet-options";
import { HiloBetMultiplierByBetOption } from "@enums/original-games";
import { BlogPostCategories } from "@enums/post-categories";
import { faker } from "@faker-js/faker";
import { emailDomainPattern, passwordPattern } from "@support/regex-patterns";

export class RegisterTestData {
	#username: string;
	#password: string;
	#email: string;

	constructor({
		email,
		username,
		password,
		useGamdomEmailDomain,
	}: RegisterTestDataParams = {}) {
		this.#username = username || faker.string.alphanumeric({ length: 7 });
		this.#password =
			password ||
			faker.internet.password({ length: 15, pattern: passwordPattern });
		this.#email = email || faker.internet.email();

		this.#email = useGamdomEmailDomain
			? this.#email.replace(emailDomainPattern, GAMDOM_EMAIL_DOMAIN)
			: this.#email;
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

	toObject(): Record<string, string> {
		return {
			username: this.#username,
			password: this.#password,
			email: this.#email,
		};
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

	constructor(options: {
		betAmount: number;
		multiplier?: number;
		rollOver?: number;
		winChance?: number;
	}) {
		this.betAmount = options.betAmount;
		this.multiplier = options.multiplier;
		this.rollOver = options.rollOver;
		this.winChance = options.winChance;
	}
}

export class DiceAutobetTestData {
	public betAmount: number;
	public numberOfBets?: number;
	public rollOver?: number;
	public stopOnProfit?: number;
	public stopOnLoss?: number;

	constructor(options: {
		betAmount: number;
		numberOfBets?: number;
		rollOver?: number;
		stopOnProfit?: number;
		stopOnLoss?: number;
	}) {
		this.betAmount = options.betAmount;
		this.numberOfBets = options.numberOfBets;
		this.rollOver = options.rollOver;
		this.stopOnProfit = options.stopOnProfit;
		this.stopOnLoss = options.stopOnLoss;
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

export class HiloCardsColorData {
	public redCards: number;
	public blackCards: number;
	public jokerCards: number;

	constructor(redCards: number, blackCards: number, jokerCards: number) {
		this.redCards = redCards;
		this.blackCards = blackCards;
		this.jokerCards = jokerCards;
	}
}

export class BlogPostTestData {
	public paragraph: string;
	public title: string;
	public subTitle: string;
	public author: string;
	public slug: string;
	public categories: BlogPostCategories[];
	public coverImage: string;
	public thumbnailImage: string;

	constructor(data: {
		paragraph: string;
		title: string;
		subTitle: string;
		author: string;
		slug: string;
		categories: BlogPostCategories[];
		coverImage: string;
		thumbnailImage: string;
	}) {
		this.paragraph = data.paragraph;
		this.title = data.title;
		this.subTitle = data.subTitle;
		this.author = data.author;
		this.slug = data.slug;
		this.categories = data.categories;
		this.coverImage = data.coverImage;
		this.thumbnailImage = data.thumbnailImage;
	}
}
