import { BlogPostCategories } from "@enums/post-categories";

export interface PromoCodesGenerators {
	name(): string;
	codeValue(): string;
}

export interface PromoCampaignCodesGenerator {
	name(promoType: string, finalStatus: string): string;
	codeValue(): string;
}

export interface CasinoGamesGenerator {
	playerName(): string;
}

export interface MailinatorGenerator {
	emailInbox(overrideEmail?: string): { email: string; inbox: string };
}

export interface BlogPostsGenerator {
	paragraph(): string;
	title(): string;
	subTitle(): string;
	author(): string;
	slug(): string;
	category(): BlogPostCategories;
}

export interface PromotionTitlesV4Generator {
	helperPromotionTitle(): string;
	promotionTitle(
		category: string,
		subCategory: string,
		label: string,
	): string;
}

export interface PromotionTitlesGenerator {
	promotionTitle(
		category: string,
		subCategory: string,
		label: string,
	): string;
}

export interface UsernameGenerator {
	username(): string;
}
