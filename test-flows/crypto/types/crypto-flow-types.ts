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
	unit?: Unit;
	testDataKey: string;
	network?: CryptoTicker;
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

export const BNB_CONFIG: CryptoConfig = {
	cryptocurrency: Cryptocurrency.BNB,
	cryptoTicker: CryptoTicker.BNB,
	cryptoNode: CryptoNode.fireBNB,
	unit: Unit.BNB_JAGER,
	testDataKey: "bnbAmountToDeposit",
};

export const USDT_ETH_CONFIG: CryptoConfig = {
	cryptocurrency: Cryptocurrency.Tether,
	cryptoTicker: CryptoTicker.USDT,
	cryptoNode: CryptoNode.fireUSDT,
	testDataKey: "usdtAmountToDeposit",
};

export const USDT_TRX_CONFIG: CryptoConfig = {
	cryptocurrency: Cryptocurrency.Tether,
	cryptoTicker: CryptoTicker.USDT_TRX,
	cryptoNode: CryptoNode.fireTRX_USDT,
	testDataKey: "usdtTrxAmountToDeposit",
	network: CryptoTicker.USDT_TRX,
};

export const USDT_BSC_CONFIG: CryptoConfig = {
	cryptocurrency: Cryptocurrency.Tether,
	cryptoTicker: CryptoTicker.USDT_BSC,
	cryptoNode: CryptoNode.fireUSDT_BSC,
	testDataKey: "usdtBscAmountToDeposit",
	network: CryptoTicker.USDT_BSC,
};

export const USD1_SOL_CONFIG: CryptoConfig = {
	cryptocurrency: Cryptocurrency.USD1,
	cryptoTicker: CryptoTicker.USD1_SOL,
	cryptoNode: CryptoNode.fireUSD1_SOL,
	testDataKey: "usd1SolAmountToDeposit",
	network: CryptoTicker.USD1_SOL,
};

export const USD1_ETH_CONFIG: CryptoConfig = {
	cryptocurrency: Cryptocurrency.USD1,
	cryptoTicker: CryptoTicker.USD1_ETH,
	cryptoNode: CryptoNode.fireUSD1_ETH,
	testDataKey: "usd1EthAmountToDeposit",
	network: CryptoTicker.USD1_ETH,
};

export const TRX_CONFIG: CryptoConfig = {
	cryptocurrency: Cryptocurrency.Tron,
	cryptoTicker: CryptoTicker.TRX,
	cryptoNode: CryptoNode.fireTRX,
	unit: Unit.TRX_SUN,
	testDataKey: "trxAmountToDeposit",
};

export const BTC_CONFIG: CryptoConfig = {
	cryptocurrency: Cryptocurrency.Bitcoin,
	cryptoTicker: CryptoTicker.BTC,
	cryptoNode: CryptoNode.nodeBTC1,
	unit: Unit.BTC_SATOSHI,
	testDataKey: "btcAmountToDeposit",
};

export const LTC_CONFIG: CryptoConfig = {
	cryptocurrency: Cryptocurrency.Litecoin,
	cryptoTicker: CryptoTicker.LTC,
	cryptoNode: CryptoNode.nodeLTC1,
	unit: Unit.LTC_LITOSHI,
	testDataKey: "ltcAmountToDeposit",
};

export const XRP_CONFIG: CryptoConfig = {
	cryptocurrency: Cryptocurrency.Ripple,
	cryptoTicker: CryptoTicker.XRP,
	cryptoNode: CryptoNode.fireXRP,
	unit: Unit.XRP_DROP,
	testDataKey: "xrpAmountToDeposit",
};

export const SOL_CONFIG: CryptoConfig = {
	cryptocurrency: Cryptocurrency.Solana,
	cryptoTicker: CryptoTicker.SOL,
	cryptoNode: CryptoNode.fireSOL,
	unit: Unit.SOL_LAMPORT,
	testDataKey: "solAmountToDeposit",
};

export const USDC_ETH_CONFIG: CryptoConfig = {
	cryptocurrency: Cryptocurrency.USDC,
	cryptoTicker: CryptoTicker.USDC_ETH,
	cryptoNode: CryptoNode.fireUSDC_ETH,
	testDataKey: "usdcEthAmountToDeposit",
	network: CryptoTicker.USDC_ETH,
};

export const USDC_SOL_CONFIG: CryptoConfig = {
	cryptocurrency: Cryptocurrency.USDC,
	cryptoTicker: CryptoTicker.USDC_SOL,
	cryptoNode: CryptoNode.fireUSDC_SOL,
	testDataKey: "usdcSolAmountToDeposit",
	network: CryptoTicker.USDC_SOL,
};

export const USDC_BSC_CONFIG: CryptoConfig = {
	cryptocurrency: Cryptocurrency.USDC,
	cryptoTicker: CryptoTicker.USDC_BSC,
	cryptoNode: CryptoNode.fireUSDC_BSC,
	testDataKey: "usdcBscAmountToDeposit",
	network: CryptoTicker.USDC_BSC,
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
