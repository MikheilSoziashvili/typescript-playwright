// TODO: Complete implementation for objects loading
export class ObjectBuilder<T extends Record<string, unknown>> {
	private object: T;

	constructor(base: T) {
		this.object = structuredClone(base);
	}

	public with(overrides: Partial<T>): this {
		this.object = { ...this.object, ...overrides };
		return this;
	}

	public build(): T {
		return structuredClone(this.object);
	}
}
