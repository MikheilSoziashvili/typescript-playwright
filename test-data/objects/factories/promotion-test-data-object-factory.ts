import { PromotionTestDataParams } from "@core/interfaces";
import { PromotionTestData } from "@dtos/test-data";
import { BaseTestDataObjectFactory } from "test-data/base/base-test-data-object-factory";

export class PromotionTestDataObjectFactory extends BaseTestDataObjectFactory<
	PromotionTestData,
	PromotionTestDataObjectFactory
> {
	public static override build(
		data: PromotionTestDataParams,
	): PromotionTestData {
		return new PromotionTestData(data);
	}
}
