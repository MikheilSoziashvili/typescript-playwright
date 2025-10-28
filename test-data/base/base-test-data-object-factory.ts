/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Abstract base class for all **test data object factories**.
 *
 * Defines a common contract for creating, configuring, and randomizing
 * strongly typed test data objects used in automated testing.
 *
 * @remarks
 * This class provides a unified interface for derived factory classes
 * (e.g. `BetTestDataObjectFactory`, `RegisterUserObjectFactory`),
 * ensuring consistency across all object-building utilities.
 *
 * Factories can optionally accept context arguments (such as user credentials)
 * when generating data, allowing flexible test setup scenarios.
 *
 * @template TData - Type of data object produced by the factory (e.g. `BetTestData`).
 * @template TSelf - The derived factory type extending this base.
 * @template TArgs - Optional arguments used for building or configuring instances.
 */
export abstract class BaseTestDataObjectFactory<
	TData extends object,
	TSelf extends BaseTestDataObjectFactory<TData, TSelf, TArgs>,
	TArgs = void,
> {
	/**
	 * Builds a new data object, optionally applying overrides or contextual arguments.
	 *
	 * @remarks
	 * This method should be overridden in each subclass to create
	 * an instance of the corresponding test data object.
	 *
	 * @param _overrides - Optional property overrides for customizing the object.
	 * @param _args - Optional contextual parameters (e.g. username, environment).
	 * @returns The constructed {@link TData} object.
	 * @throws When not implemented by a subclass.
	 */
	public static build(
		_overrides?: Partial<unknown>,
		_args?: unknown,
	): unknown {
		throw new Error(
			`Class ${this.name} must implement its own static 'build()' method.`,
		);
	}

	/**
	 * Returns a default instance of the data object.
	 *
	 * @remarks
	 * Should be overridden to provide a canonical "baseline" test object
	 * suitable for most scenarios (e.g. default user, default bet configuration).
	 *
	 * @param args - Optional arguments for contextual initialization.
	 * @returns A default instance of {@link TData}.
	 * @throws When not implemented by a subclass.
	 */
	public static default(args?: unknown): unknown {
		throw new Error(
			`Class ${this.name} must implement its own static 'default()' method.`,
		);
	}

	/**
	 * Returns a collection of named preconfigured variants.
	 *
	 * @remarks
	 * Subclasses can override this method to expose reusable presets
	 * such as “high roller”, “safe player”, or “guest user”.
	 *
	 * @param args - Optional arguments used to adjust preconfigured variants.
	 * @returns A record of named presets mapped to test data objects.
	 */
	public static preconfigured(args?: unknown): Record<string, unknown> {
		return {};
	}

	/**
	 * Returns a randomized instance of the data object.
	 *
	 * @remarks
	 * This method should be overridden to generate randomized yet valid
	 * test data objects — for example, random bet amounts or user IDs.
	 *
	 * @param args - Optional arguments to influence randomization behavior.
	 * @returns A randomly generated {@link TData} instance.
	 * @throws When not implemented by a subclass.
	 */
	public static random(args?: unknown): unknown {
		throw new Error(
			`Class ${this.name} must implement its own static 'random' getter.`,
		);
	}
}
