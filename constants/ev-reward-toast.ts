import { ExpectedResultToastKey } from "@enums/expected-reward-toast-keys";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";

export const EXPECTED_TOAST_BY_KEY: Record<
	ExpectedResultToastKey,
	Readonly<{ title: ToastTitle; subtitle: ToastSubTitle }>
> = {
	[ExpectedResultToastKey.START_IN_PAST]: {
		title: ToastTitle.FAILED,
		subtitle: ToastSubTitle.START_IN_PAST,
	},
	[ExpectedResultToastKey.EXPIRY_BEFORE_START]: {
		title: ToastTitle.FAILED,
		subtitle: ToastSubTitle.EXPIRY_BEFORE_START,
	},
	[ExpectedResultToastKey.PROCESSED_OK]: {
		title: ToastTitle.SUCCESS,
		subtitle: ToastSubTitle.PROCESSED_OK,
	},
} as const;
