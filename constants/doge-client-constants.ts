import * as bitcoin from "bitcoinjs-lib";

export const DOGECOIN_TESTNET: bitcoin.Network = {
	messagePrefix: "\x19Dogecoin Signed Message:\n",
	bech32: "tdge",
	bip32: {
		public: 0x043587cf,
		private: 0x04358394,
	},
	pubKeyHash: 0x71,
	scriptHash: 0xc4,
	wif: 0xf1,
};

// Fee configuration
export const DOGE_FEE_SATOSHIS = 100000; // 0.001 DOGE (fixed fee)
export const DOGE_FEE_PER_BYTE = 1000; // 1000 satoshis per byte (for dynamic fees)
export const DOGE_MIN_BALANCE = 10; // Minimum balance for operations
export const DOGE_FEE_BUFFER = 10;
