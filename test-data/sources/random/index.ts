import { generateRandomString } from "@core/utils/utils";
import { PromoCodesGenerators } from "test-data/interfaces/random";
import { PredefinedData, PredefinedRandomData } from "test-data/types";

export class RandomDataSourceGenerator {
	private predefined: PredefinedData;
	private predefinedRandom: PredefinedRandomData;

	constructor(
		predefined: PredefinedData,
		predefinedRandom: PredefinedRandomData,
	) {
		this.predefined = predefined;
		this.predefinedRandom = predefinedRandom;
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
}
