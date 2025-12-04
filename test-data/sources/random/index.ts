import { generateRandomString, getRandomIndex } from "@core/utils/utils";
import { BlogPostCategories } from "@enums/post-categories";
import {
	BlogPostsGenerator,
	CasinoGamesGenerator,
	PromoCampaignCodesGenerator,
	PromoCodesGenerators,
} from "test-data/interfaces/random";
import { PredefinedData, PredefinedRandomData } from "test-data/types";

export class RandomDataSourceGenerator {
	private predefined: PredefinedData;
	private predefinedRandom: PredefinedRandomData;

	public generators: { promoCampaignCodes: PromoCampaignCodesGenerator };

	constructor(
		predefined: PredefinedData,
		predefinedRandom: PredefinedRandomData,
	) {
		this.predefined = predefined;
		this.predefinedRandom = predefinedRandom;

		this.generators = {
			promoCampaignCodes: this.promoCampaignCodes,
		};
	}

	public get promoCodes(): PromoCodesGenerators {
		return {
			name: () =>
				`${
					this.predefinedRandom.promoCodes.campaignName
				}${generateRandomString({ length: 3 })}`,
			codeValue: () =>
				`${
					this.predefinedRandom.promoCodes.campaignCode
				}${generateRandomString({ length: 3 })}`,
		};
	}

	public get promoCampaignCodes(): PromoCampaignCodesGenerator {
		return {
			name: (
				promoType: string,
				finalStatus: string,
			) => `auto_${promoType.toLowerCase()}
						_${finalStatus.toLowerCase()}_${
				this.predefinedRandom.promoCodes.campaignName
			}${generateRandomString({ length: 3 })}`,
			codeValue: () =>
				`${
					this.predefinedRandom.promoCodes.campaignCode
				}${generateRandomString({ length: 7 })}`,
		};
	}

	public get casinoGames(): CasinoGamesGenerator {
		return {
			playerName: () => this.predefinedRandom.casinoGames.playerName,
		};
	}

	public get blogPosts(): BlogPostsGenerator {
		return {
			paragraph: () =>
				generateRandomString({
					prefix: "automation_blog_paragraph_",
					length: 5,
				}),
			title: () =>
				generateRandomString({
					prefix: "automation_blog_title_",
				}),
			subTitle: () =>
				generateRandomString({
					prefix: "automation_blog_sub_title_",
				}),
			author: () =>
				generateRandomString({
					prefix: "automation_blog_author_",
				}),
			slug: () =>
				generateRandomString({
					prefix: "automation-blog-slug-",
				}),
			category: () => {
				const values = Object.values(BlogPostCategories);
				const randomIndex = getRandomIndex(values.length);
				return values[randomIndex] as BlogPostCategories;
			},
		};
	}
}
