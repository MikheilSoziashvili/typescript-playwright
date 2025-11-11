import { BetTestDataObjectFactory } from "./factories/bet-test-data-object-factory";
import { RegisterTestDataObjectFactory } from "./factories/register-test-data-object-factory";

export const objectFactoryRegistry = {
	bet: BetTestDataObjectFactory,
	register: RegisterTestDataObjectFactory,
};
