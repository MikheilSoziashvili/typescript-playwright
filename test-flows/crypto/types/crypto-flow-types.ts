import { Page } from "@playwright/test";
import { BrowserSessionManager } from "@core/browser-session-mngmt";
import { Cryptocurrency, CryptoTicker } from "@enums/cryptocurrencies";
import { CryptoNode } from "@enums/crypto-nodes";
import { Unit } from "@enums/units";
import { CryptoAdminPage } from "@pages/admin/crypto-admin/crypto-admin-page";
import { HomePage } from "@pages/home-page/home-page";
import { WalletModal } from "@pages/modals/wallet/wallet-modal";
import { TransactionsPage } from "@pages/transactions/transactions-page";
import { TransactionDetailsModal } from "@pages/modals/transaction-details-modal/transaction-details-modal";
import { Toast } from "@pages/components/toast/toast";
import { DiceGamePage } from "@pages/dice-game-page/dice-game-page";
import { UserInfoAdminPage } from "@pages/admin/user-info-admin/user-info-admin-page";
import { UserInfoTransactionsAdminPage } from "@pages/admin/user-info-admin/user-info-transactions-admin/user-info-transactions-admin-page";
import { UserBalanceHandler } from "@core/handlers/user-balance-handler/user-balance-handler";
import { GamdomApi } from "@api/gamdom-api";
import { GamdomDb } from "database/gamdom-db";
import { PredefinedDataSource } from "test-data/core/predefined-data-source";

export interface CryptoTestData {
	amountToDeposit: string;
	withdrawalAddress: string;
}

export interface CryptoClient {
	sendToAddress(
		address: string,
		amount: string,
		destinationTag?: number | string,
	): Promise<{ id: string }>;
	waitForCompletion(id: string): Promise<unknown>;
	getTransaction(id: string): Promise<{ txHash: string }>;
}

export interface CryptoConfig {
	cryptocurrency: Cryptocurrency;
	cryptoTicker: CryptoTicker;
	cryptoNode: CryptoNode;
	unit: Unit;
	testDataKey: string;
}

export function getCryptoTestData(
	testDataPredefined: PredefinedDataSource,
	config: CryptoConfig,
): CryptoTestData {
	return testDataPredefined.data[
		config.testDataKey as keyof typeof testDataPredefined.data
	] as CryptoTestData;
}

export const ETH_CONFIG: CryptoConfig = {
	cryptocurrency: Cryptocurrency.Ethereum,
	cryptoTicker: CryptoTicker.ETH,
	cryptoNode: CryptoNode.fireETH,
	unit: Unit.ETH_GWEI,
	testDataKey: "ethAmountToDeposit",
};

export interface CryptoFlowDependencies {
	page: Page;
	browserSessionManager: BrowserSessionManager;
	cryptoAdminPage: CryptoAdminPage;
	homePage: HomePage;
	walletModal: WalletModal;
	transactionsPage: TransactionsPage;
	transactionDetailsModal: TransactionDetailsModal;
	toast: Toast;
	diceGamePage: DiceGamePage;
	userInfoAdminPage: UserInfoAdminPage;
	transactionsAdminPage: UserInfoTransactionsAdminPage;
	userBalanceHandler: UserBalanceHandler;
	gamdomApi: GamdomApi;
	gamdomDb: GamdomDb;
	testDataPredefined: PredefinedDataSource;
}

export interface WithdrawalSetupResult {
	initialBalanceUSD: number;
	isVip: boolean;
}

export interface DepositProcessResult {
	depositTransactionId: string;
	txHash: string;
	initialBalanceCoins: number;
	amountToDeposit: string;
}

export interface WithdrawalProcessResult {
	amountToWithdraw: number;
	withdrawalFee: string;
	withdrawnAmountAfterFee: number;
}

export interface WithdrawalUserVerificationResult {
	withdrawTransactionId: string;
}
