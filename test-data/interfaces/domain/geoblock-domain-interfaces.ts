import { SoftBlockedCountry } from "@enums/geoblocked-countries";

export interface OAuthExpectations {
	steam: boolean;
	google: boolean;
	telegram: boolean;
}

export interface OAuthScenario {
	country: SoftBlockedCountry;
	expectations: OAuthExpectations;
}
