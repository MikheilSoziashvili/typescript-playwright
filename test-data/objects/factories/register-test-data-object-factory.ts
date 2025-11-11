import { RegisterTestData } from "@dtos/test-data";
import { BaseTestDataObjectFactory } from "test-data/base/base-test-data-object-factory";
import { RegisterTestDataParams } from "@core/interfaces";

export class RegisterTestDataObjectFactory extends BaseTestDataObjectFactory<
	RegisterTestData,
	RegisterTestDataObjectFactory
> {
	/**
	 * Builds a new RegisterTestData instance with optional overrides.
	 *
	 * @param overrides - Optional property overrides for customizing the registration data.
	 * @returns A new RegisterTestData instance.
	 */
	public static override build(
		overrides?: Partial<RegisterTestDataParams>,
	): RegisterTestData {
		return new RegisterTestData(overrides);
	}

	/**
	 * Creates a default RegisterTestData instance with standard configuration.
	 *
	 * @returns A RegisterTestData instance with default values.
	 */
	public static override default(): RegisterTestData {
		return new RegisterTestData();
	}

	/**
	 * Returns preconfigured RegisterTestData variants for common test scenarios.
	 *
	 * @returns A record of named presets for different registration scenarios.
	 */
	public static override preconfigured(): {
		standard: RegisterTestData;
		withGamdomEmail: RegisterTestData;
		withCustomCredentials: RegisterTestData;
	} {
		return {
			standard: new RegisterTestData(),
			withGamdomEmail: new RegisterTestData({
				useGamdomEmailDomain: true,
			}),
			withCustomCredentials: new RegisterTestData({
				username: "test_user",
				email: "test@example.com",
				password: "TestPassword123!",
			}),
		};
	}

	/**
	 * Creates a RegisterTestData instance with randomized values.
	 * Since RegisterTestData already generates random values by default,
	 * this method creates a new instance to ensure fresh randomization.
	 *
	 * @returns A RegisterTestData instance with fresh random values.
	 */
	public static override random(): RegisterTestData {
		return new RegisterTestData();
	}
}
