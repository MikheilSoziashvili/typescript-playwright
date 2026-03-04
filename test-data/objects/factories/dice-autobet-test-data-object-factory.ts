import { DiceAutobetTestData } from "@dtos/test-data";
import { DiceAutobetCsvParsedRecord } from "test-data/parsers/dice-autobet-csv-parser";
import { BaseTestDataObjectFactory } from "test-data/base/base-test-data-object-factory";

export class DiceAutobetTestDataObjectFactory extends BaseTestDataObjectFactory<
	DiceAutobetTestData,
	DiceAutobetTestDataObjectFactory
> {
	public static fromCsvRecord(
		record: DiceAutobetCsvParsedRecord,
	): DiceAutobetTestData {
		return new DiceAutobetTestData({
			betAmount: record.betAmount,
			rollOver: record.rollOver,
			numberOfBets: record.numberOfBets,
			stopOnProfit: record.stopOnProfit,
			stopOnLoss: record.stopOnLoss,
		});
	}

	public static override preconfigured(): {
		stopAutobet: DiceAutobetTestData;
	} {
		return {
			stopAutobet: new DiceAutobetTestData({
				betAmount: 1,
				numberOfBets: 0,
				rollOver: 50,
			}),
		};
	}
}
