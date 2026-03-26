import { RouletteBetColor } from "@enums/original-games";
import { GreenHuntTypeOption } from "@enums/roulette-autobet-section";
import { RouletteBetTestData } from "@dtos/test-data";
import {
	GreenHuntBetData,
	GreenHuntConfig,
	GreenHuntScenario,
} from "test-data/interfaces/domain/roulette-domain-interfaces";

export class RouletteDomainData {
	public readonly greenHuntConfig: GreenHuntConfig = {
		betAmount: 10,
		greenHuntValue: 10,
		betColor: RouletteBetColor.RED,
	};

	public readonly greenHuntScenarios: GreenHuntScenario[] = [
		{
			when: GreenHuntTypeOption.PERCENT,
			expectedGreenBet: 1,
		},
		{
			when: GreenHuntTypeOption.MONEY,
			expectedGreenBet: 1,
		},
	];

	public buildGreenHuntBetData(username: string): GreenHuntBetData {
		const { betAmount, greenHuntValue, betColor } = this.greenHuntConfig;
		const bet = new RouletteBetTestData(username, betAmount, betColor);
		return { greenHuntValue, bet };
	}
}
