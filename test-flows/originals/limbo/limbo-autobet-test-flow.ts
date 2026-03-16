import { BaseTestFlow } from "@test-flows";
import { testFlow } from "@test-flows";
import { LimboAutobetSetupFlow } from "./limbo-autobet-setup-test-flow";
import { LimboAutobetExecutionFlow } from "./limbo-autobet-execution-test-flow";
import { LimboBetTestData } from "@dtos/test-data";

export class LimboAutobetTestFlow extends BaseTestFlow {
	constructor(
		private readonly setupFlow: LimboAutobetSetupFlow,
		private readonly executionFlow: LimboAutobetExecutionFlow,
	) {
		super();
	}

	@testFlow("Execute Limbo autobet scenario")
	public async executeAutobetScenario(params: {
		limboBetData: LimboBetTestData;
		numberOfRounds: number;
	}): Promise<void> {
		const { limboBetData, numberOfRounds } = params;

		const { user, initialCoins } =
			await this.setupFlow.setupAndStartAutoPlay({
				limboBetData,
			});

		await this.executionFlow.playRoundsAndStop({
			user,
			limboBetData,
			numberOfRounds,
			initialCoins,
		});
	}
}
