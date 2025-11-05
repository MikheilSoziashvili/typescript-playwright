import { generateRandomString } from "@core/utils/utils";
import {
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
}
