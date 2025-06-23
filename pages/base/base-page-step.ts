import { BasePage } from "@base/base-page";
import { BaseMap } from "./base-map";
import { UserBalanceHandler } from "@core/handlers/user-balance-handler";

export class BasePageStep<T extends BasePage<U>, U extends BaseMap = BaseMap> {
	readonly gamdomPage: T;
	protected readonly userBalanceHandler: UserBalanceHandler;

	public constructor(gamdomPage: T) {
		this.gamdomPage = gamdomPage;
		this.userBalanceHandler = new UserBalanceHandler(gamdomPage.page);
	}
}
