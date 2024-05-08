import { BaseComponent } from "@base/base-component";

export class BaseComponentStep<T extends BaseComponent> {
	readonly component: T;

	public constructor(component: T) {
		this.component = component;
	}
}
