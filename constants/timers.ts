import { SelfExclusionTimer } from "@enums/self-exclusion-timer";
import { SelfExclusionDays } from "@enums/self-exlusion-days";

export const INITIAL_TIMER = `00:00:00:00`;

export const SELF_EXCLUSION_TIMER_MAP: Record<
	SelfExclusionDays,
	SelfExclusionTimer
> = {
	[SelfExclusionDays.ONE_DAY]: SelfExclusionTimer.ONE_DAY_TIMER,
	[SelfExclusionDays.FIVE_DAYS]: SelfExclusionTimer.FIVE_DAYS_TIMER,
	[SelfExclusionDays.EIGHT_DAYS]: SelfExclusionTimer.EIGHT_DAYS_TIMER,
};
