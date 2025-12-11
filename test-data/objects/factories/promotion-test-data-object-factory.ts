import { PromotionTestDataParamsV4 } from "@core/interfaces";
import { PromotionTestDataV4 } from "@dtos/test-data";
import { BaseTestDataObjectFactory } from "test-data/base/base-test-data-object-factory";

export class PromotionTestDataObjectFactory extends BaseTestDataObjectFactory<
	PromotionTestDataV4,
	PromotionTestDataObjectFactory
> {
	public static override build(
		data: PromotionTestDataParamsV4,
	): PromotionTestDataV4 {
		return new PromotionTestDataV4(data);
	}
}
