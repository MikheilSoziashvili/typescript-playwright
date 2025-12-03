export enum VisualComparisonThreshold {
	STRICT = 0.05,
	NORMAL = 0.1,
	RELAXED = 0.2,
	VERY_RELAXED = 0.3,
	ULTRA_RELAXED = 0.4,
}

export enum VisualAutomationPolling {
	INTERVAL_MS = 100,
	MIN_STEP_SIZE = 1,
	MAX_STEP_SIZE = 10,
}

export enum VisualAutomationDefaults {
	COLOR_THRESHOLD = 30,
	MIN_CONFIDENCE = 0.5,
	EARLY_EXIT_CONFIDENCE = 0.99,
	QUICK_CHECK_TIMEOUT = 1000,
	OVERLAP_THRESHOLD_RATIO = 0.6,
}
