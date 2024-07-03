import { APIResponse } from "playwright/test";

export type KnownError = Error & { response?: APIResponse };
