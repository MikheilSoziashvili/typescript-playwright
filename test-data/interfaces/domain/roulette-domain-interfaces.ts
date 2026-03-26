import { GreenHuntTypeOption } from "@enums/roulette-autobet-section";
import { RouletteBetColor } from "@enums/original-games";
import { RouletteBetTestData } from "@dtos/test-data";

export interface GreenHuntConfig {
	betAmount: number;
	greenHuntValue: number;
	betColor: RouletteBetColor;
}

export interface GreenHuntScenario {
	when: GreenHuntTypeOption;
	expectedGreenBet: number;
}

export type GreenHuntBetData = Omit<
	GreenHuntConfig,
	keyof RouletteBetTestData
> & {
	bet: RouletteBetTestData;
};
