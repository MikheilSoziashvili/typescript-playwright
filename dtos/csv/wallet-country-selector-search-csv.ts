import { CountrySelectorState } from "@enums/country-selector-state";
import { KeyboardKey } from "@enums/keyboard";

export interface WalletCountrySelectorSearchCsvRecord {
	search_queries: string;
	search_input: string;
	action: KeyboardKey | "";
	expected_state: CountrySelectorState;
}

export type WalletCountrySelectorSearchCsv = WalletCountrySelectorSearchCsvRecord[];
