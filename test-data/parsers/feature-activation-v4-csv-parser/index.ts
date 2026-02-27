import { FeatureActivationV4CsvRecord } from "@dtos/csv/feature-activation-v4-csv";
import { UserTags } from "@enums/db/user-tags";
import { BooleanValueString } from "@enums/playwright/booleanValues";
import { UserType } from "@enums/user-types";
import { expect } from "@playwright/test";

const USER_TYPE_CONFIG: Readonly<
	Partial<Record<string, { userType: UserType; userTag?: UserTags }>>
> = {
	Regular: { userType: UserType.REGULAR },
	Beta: { userType: UserType.BETA, userTag: UserTags.BetaUser },
	QA: { userType: UserType.QA_USER, userTag: UserTags.QaUser },
	Developer: { userType: UserType.DEVELOPER, userTag: UserTags.Developer },
};

const VALID_LABELS = Object.keys(USER_TYPE_CONFIG).join(", ");

const parseLabels = (value: string) =>
	value.split("+").map((label) => {
		const trimmed = label.trim();
		const config = USER_TYPE_CONFIG[trimmed];
		expect(
			config,
			`Unknown user type label: "${trimmed}". Valid labels: ${VALID_LABELS}`,
		).toBeDefined();
		return config as { userType: UserType; userTag?: UserTags };
	});

/**
 * Builds a complete feature-state map with explicit true/false for every
 * user type, so a single `setFeatureState` call is enough (no need to
 * disable-all first).
 */
const buildFullFeatureStates = (
	enabledLabels: string,
): Partial<Record<UserType, boolean>> => {
	const enabledTypes = new Set(
		parseLabels(enabledLabels).map(({ userType }) => userType),
	);
	return Object.fromEntries(
		Object.values(USER_TYPE_CONFIG)
			.filter(
				(cfg): cfg is { userType: UserType; userTag?: UserTags } =>
					cfg !== undefined,
			)
			.map(({ userType }) => [userType, enabledTypes.has(userType)]),
	);
};

export interface FeatureActivationV4CsvParsedRecord {
	userType: string;
	loginUserTag: string;
	enabledUserTypes: Partial<Record<UserType, boolean>>;
	loginTags: UserTags[];
	v4BeforeLogin: boolean;
	v4AfterLogin: boolean;
}

export const parseFeatureActivationV4CsvRow = (
	row: FeatureActivationV4CsvRecord,
): FeatureActivationV4CsvParsedRecord => ({
	userType: row.userType,
	loginUserTag: row.loginUserTag,
	enabledUserTypes: buildFullFeatureStates(row.userType),
	loginTags: parseLabels(row.loginUserTag)
		.map(({ userTag }) => userTag)
		.filter((tag): tag is UserTags => tag !== undefined),
	v4BeforeLogin: row.v4BeforeLogin === BooleanValueString.TRUE,
	v4AfterLogin: row.v4AfterLogin === BooleanValueString.TRUE,
});
