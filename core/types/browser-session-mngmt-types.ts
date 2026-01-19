import { AllApisType } from "@api/index";
import { GamdomApiDbFacade } from "@core/facades/gamdom-api-db/gamdom-api-db-facade";
import { AllGamdomPagesType } from "@pages/index";
import { BrowserContext } from "@playwright/test";
import { ProxyCredentialsType } from "./types";

export type Pages = {
	[K in keyof AllGamdomPagesType]: InstanceType<AllGamdomPagesType[K]>;
};

export type StorageState = Awaited<ReturnType<BrowserContext["storageState"]>>;

export type ApiPromises = {
	[K in keyof AllApisType]: Promise<InstanceType<AllApisType[K]>>;
};

export type StorageStateAwareApi = {
	addContextStorageState(storageState: StorageState): Promise<void>;
};

export type SessionContextOptions = {
	reuseContext?: boolean;
	proxyCredentials?: ProxyCredentialsType;
};

export type BrowserSessionLoginOptions = SessionContextOptions & {
	regularUserOptions?: Parameters<
		GamdomApiDbFacade["createSingleUserDbAndAuth"]
	>[0];
	regularUserWalletOptions?: Parameters<
		GamdomApiDbFacade["createUserWithWalletsAndAuth"]
	>[0];
};
