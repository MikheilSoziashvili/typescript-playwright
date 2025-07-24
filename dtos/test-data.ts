import { GAMDOM_EMAIL_DOMAIN } from "@constants/domains";
import {
	PromotionTestDataParams,
	RegisterTestDataParams,
} from "@core/interfaces";
import { HiloBetOption } from "@enums/hilo-bet-options";
import {
	HiloBetMultiplierByBetOption,
	OriginalGame,
	OriginalsQuickSelectButtons,
} from "@enums/original-games";
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

export class MinesBetTestData {
	public betAmount: number;
	public minesNumber: number;
	public cashoutMultiplier: number;

	constructor(options: {
		betAmount?: number;
		minesNumber: number;
		cashoutMultiplier: number;
	}) {
		this.betAmount = options.betAmount ?? 0.01;
		this.minesNumber = options.minesNumber;
		this.cashoutMultiplier = options.cashoutMultiplier;
	}
}

export class MinesAutobetTestData {
	public numberOfAutobetRounds: number;
	public onWinIncreaseByPercent: number;
	public onLossIncreaseByPercent: number;

	constructor(options: {
		numberOfAutobetRounds: number;
		onWinIncreaseByPercent: number;
		onLossIncreaseByPercent: number;
	}) {
		this.numberOfAutobetRounds = options.numberOfAutobetRounds;
		this.onWinIncreaseByPercent = options.onWinIncreaseByPercent;
		this.onLossIncreaseByPercent = options.onLossIncreaseByPercent;
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

export type QuickSelectScenario = {
	buttonType: OriginalsQuickSelectButtons;
	game: OriginalGame;
	initialBetAmount: number;
	expectedAfterFirstClick: number;
	expectedAfterSecondClick: number;
};

export type RawQuickSelectScenario = {
	buttonType: string;
	game: string;
	initialBetAmount: string;
	expectedAfterFirstClick: string;
	expectedAfterSecondClick: string;
};

export interface RawNegativeBetValidationScenario {
	game: string;
	negativeBetAmount: string;
	expectedBetAmount: string;
}

export interface NegativeBetValidationScenario {
	game: OriginalGame;
	negativeBetAmount: number;
	expectedBetAmount: number;
}

export class PromotionTestData {
	public title: string;
	public customUrl: string;
	public priority: number;
	public shortDescription: string;
	public detailedDescription: string;
	public termsAndConditions: string;
	public howToParticipate: string;
	public prizesDescription: string;
	public buttonText: string;
	public buttonLink: string;
	public isForVip: string;
	public promotionCategory: string;
	public promotionSubCategory: string;
	public coverImage: string;
	public thumbnailImage: string;

	constructor(data: PromotionTestDataParams) {
		this.title = data.title;
		this.customUrl = data.customUrl;
		this.isForVip = data.isForVip;
		this.promotionCategory = data.promotionCategory;
		this.promotionSubCategory = data.promotionSubCategory;
		this.coverImage =
			data.coverImage ??
			"./test-files/ENG-5576-promotion-cover-image.jpg";
		this.thumbnailImage =
			data.thumbnailImage ??
			"./test-files/ENG-5576-promotion-thumbnail-image.jpg";
		this.priority = data.priority ?? 1;
		this.shortDescription =
			data.shortDescription ?? "Automation test short description";
		this.detailedDescription =
			data.detailedDescription ?? "Automation test detailed description";
		this.termsAndConditions =
			data.termsAndConditions ?? "Automation test terms and conditions";
		this.howToParticipate =
			data.howToParticipate ?? "Automation test how to participate";
		this.prizesDescription =
			data.prizesDescription ?? "Automation test prizes description";
		this.buttonText = data.buttonText ?? "Automation Button";
		this.buttonLink = data.buttonLink ?? "automation-button-link";
	}
}
