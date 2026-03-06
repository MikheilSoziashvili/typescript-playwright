import {
	AU_PROXY_CREDENTIALS,
	BE_PROXY_CREDENTIALS,
	DE_PROXY_CREDENTIALS,
	DK_PROXY_CREDENTIALS,
	ES_PROXY_CREDENTIALS,
	FR_PROXY_CREDENTIALS,
	NL_PROXY_CREDENTIALS,
	PT_PROXY_CREDENTIALS,
	SK_PROXY_CREDENTIALS,
	UK_PROXY_CREDENTIALS,
	US_PROXY_CREDENTIALS,
} from "@constants/proxies";
import { ProxyCredentialsType } from "@core/types/types";
import {
	GeoblockedCountry,
	SoftBlockedCountry,
} from "@enums/geoblocked-countries";
import { OAuthScenario } from "test-data/interfaces";

export class GeoblockDomainData {
	public readonly geoblockedCredentialsMap = new Map<
		string,
		ProxyCredentialsType
	>([
		[GeoblockedCountry.UNITED_STATED, US_PROXY_CREDENTIALS],
		[GeoblockedCountry.BELGIUM, BE_PROXY_CREDENTIALS],
		[GeoblockedCountry.NETHERLANDS, NL_PROXY_CREDENTIALS],
		[GeoblockedCountry.DENMARK, DK_PROXY_CREDENTIALS],
	]);

	public readonly softBlockedCredentialsMap = new Map<
		string,
		ProxyCredentialsType
	>([
		[SoftBlockedCountry.PORTUGAL, PT_PROXY_CREDENTIALS],
		[SoftBlockedCountry.UNITED_KINGDOM, UK_PROXY_CREDENTIALS],
		[SoftBlockedCountry.GERMANY, DE_PROXY_CREDENTIALS],
		[SoftBlockedCountry.SPAIN, ES_PROXY_CREDENTIALS],
		[SoftBlockedCountry.AUSTRALIA, AU_PROXY_CREDENTIALS],
		[SoftBlockedCountry.SLOVAKIA, SK_PROXY_CREDENTIALS],
		[SoftBlockedCountry.FRANCE, FR_PROXY_CREDENTIALS],
	]);

	public readonly oAuthScenarios: OAuthScenario[] = [
		{
			country: SoftBlockedCountry.GERMANY,
			expectations: {
				steam: false,
				google: false,
				telegram: false,
			},
		},
	];

	public readonly countries = [
		GeoblockedCountry.UNITED_STATED,
		GeoblockedCountry.BELGIUM,
		GeoblockedCountry.NETHERLANDS,
		GeoblockedCountry.DENMARK,
	];

	public readonly softBlockedCountries = [
		SoftBlockedCountry.PORTUGAL,
		SoftBlockedCountry.UNITED_KINGDOM,
		SoftBlockedCountry.GERMANY,
		SoftBlockedCountry.SPAIN,
		SoftBlockedCountry.AUSTRALIA,
		SoftBlockedCountry.FRANCE,
	];

	public readonly softBlockedWithoutLoginCountries = [
		SoftBlockedCountry.SLOVAKIA,
	];
}
