import { BaseComponent } from "@base/base-component";
import { BaseMap } from "./base-map";

export class BaseComponentStep<
	T extends BaseComponent<U>,
	U extends BaseMap = BaseMap,
> {
	readonly component: T;

	public constructor(component: T) {
		this.component = component;
	}
}
