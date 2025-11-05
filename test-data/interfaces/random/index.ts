export interface PromoCodesGenerators {
	name(): string;
	codeValue(): string;
}

export interface PromoCampaignCodesGenerator {
	name(promoType: string, finalStatus: string): string;
	codeValue(): string;
}

