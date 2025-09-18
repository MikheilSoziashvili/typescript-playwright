import { KothEventDuration } from "@enums/admin/koth-event-duration";

export const KOTH_END_DATES_MAP: Record<KothEventDuration, number> = {
	[KothEventDuration.ONE_DAY]: 1,
	[KothEventDuration.THREE_DAYS]: 3,
	[KothEventDuration.SEVEN_DAYS]: 7,
	[KothEventDuration.FOURTEEN_DAYS]: 14,
	[KothEventDuration.THIRTY_DAYS]: 30,
};
